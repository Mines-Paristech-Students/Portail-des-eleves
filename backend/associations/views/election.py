from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response

from associations.models import Election, Choice, Voter
from associations.permissions.election import (
    VoterPermission,
    ChoicePermission,
    ElectionPermission,
    ResultsPermission,
    VotePermission,
)
from associations.serializers.election import (
    ElectionSerializer,
    VoterSerializer,
    ChoiceSerializer,
    VoteSerializer,
)
from associations.serializers.election_read_only import (
    ChoiceReadOnlySerializer,
    ElectionReadOnlySerializer,
)


class VoterViewSet(viewsets.ModelViewSet):
    queryset = Voter.objects.all()
    serializer_class = VoterSerializer
    permission_classes = (VoterPermission,)

    def perform_create(self, serializer):
        # Only allow creation if the election has not started.
        if serializer.validated_data["election"].has_started:
            raise ValidationError("The voter cannot be added anymore.")

        serializer.save()

    def perform_update(self, serializer):
        # The status can only be updated from PENDING to ONLINE_VOTE or OFFLINE_VOTE.
        if self.get_object().status != "PENDING":
            raise ValidationError("The status cannot be updated anymore.")

        # Do not change the user and the election.
        serializer.save(
            user=self.get_object().user, election=self.get_object().election
        )

    def perform_destroy(self, instance: Voter):
        # Only allow deletion if the election has not started.
        if instance.election.has_started:
            raise ValidationError("The voter cannot be deleted anymore.")

        instance.delete()


class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceReadOnlySerializer
    permission_classes = (ChoicePermission,)

    def get_serializer_class(self):
        if self.action == "create":
            return ChoiceSerializer
        elif self.action == "list":
            return ChoiceReadOnlySerializer

        role = self.request.user.get_role(self.get_object().election.association)

        if role and role.election:
            return ChoiceSerializer

        return ChoiceReadOnlySerializer

    def perform_create(self, serializer):
        # Only allow creation if the election has not started.
        if serializer.validated_data["election"].has_started:
            raise ValidationError("The choice cannot be added anymore.")

        serializer.save()

    def perform_update(self, serializer):
        choice = self.get_object()
        override = {"election": choice.election}

        # If the election has started, do not change the name.
        if self.get_object().election.has_started:
            override["name"] = choice.name

        serializer.save(**override)

    def perform_destroy(self, instance: Choice):
        # Only allow deletion if the election has not started.
        if instance.election.has_started:
            raise ValidationError("The choice cannot be deleted anymore.")

        instance.delete()


class ElectionViewSet(viewsets.ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionReadOnlySerializer
    permission_classes = (ElectionPermission,)

    def get_serializer_class(self):
        if self.action == "create":
            return ElectionSerializer
        elif self.action == "list":
            return ElectionReadOnlySerializer

        role = self.request.user.get_role(self.get_object().association)

        if role and role.election:
            return ElectionSerializer

        return ElectionReadOnlySerializer

    def perform_update(self, serializer):
        # If the election has started, only allow to change `results_are_published`.
        election = self.get_object()
        override = {
            key: getattr(election, key)
            for key in (
                "association",
                "name",
                "starts_at",
                "ends_at",
                "max_choices_per_ballot",
                "choices",
                "voters",
            )
        }

        serializer.save(**override)

    def perform_destroy(self, instance: Election):
        # Only allow deletion if the election has not started.
        if instance.has_started:
            raise ValidationError("The election cannot be deleted anymore.")

        instance.delete()

    @action(detail=True, methods=("put",))  # , permission_classes=(VotePermission,))
    def vote(self, *args, **kwargs):
        serializer = VoteSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)

        election = self.get_object()

        # Check if the election is active.
        if not election.is_active:
            raise PermissionDenied("This election is not active.")

        # Check if the user is allowed to vote.
        if not election.voters.filter(
            user=self.request.user, status="PENDING"
        ).exists():
            raise PermissionDenied("You are not allowed to vote.")

        # Check if all the choices belong to the election.
        if any(
            (
                choice.election != election
                for choice in serializer.validated_data["choices"]
            )
        ):
            raise ValidationError("An invalid choice was provided.")

        # Check if not too many choices have been provided.
        if len(serializer.validated_data["choices"]) > election.max_choices_per_ballot:
            raise ValidationError("Too many choices were provided.")

        # Update the voter state.
        voter = election.voters.get(user=self.request.user, status="PENDING")
        voter.status = "OFFLINE_VOTE"
        voter.save()

        # Update the choices.
        for choice in serializer.validated_data["choices"]:
            choice.number_of_online_votes += 1
            choice.save()

        return Response(
            data={"choices": [c.id for c in serializer.validated_data["choices"]]},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=("get",), permission_classes=(ResultsPermission,))
    def results(self, *args, **kwargs):
        election = self.get_object()
        data = {"election": election.id, "results": election.results}
        return Response(data=data, status=status.HTTP_200_OK)
