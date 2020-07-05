from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from associations.models import Election, Choice, Voter
from associations.permissions.election import (
    VoterPermission,
    ChoicePermission,
    ElectionPermission,
    ResultsPermission,
)
from associations.serializers.election import (
    ElectionSerializer,
    VoterSerializer,
    ChoiceSerializer,
)
from associations.serializers.election_read_only import (
    VoterReadOnlySerializer,
    ChoiceReadOnlySerializer,
    ElectionReadOnlySerializer,
)


class VoterViewSet(viewsets.ModelViewSet):
    queryset = Voter.objects.all()
    serializer_class = VoterReadOnlySerializer
    permission_classes = (VoterPermission,)

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return VoterReadOnlySerializer

        return VoterSerializer

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

    @action(detail=True, methods=("get",), permission_classes=(ResultsPermission,))
    def results(self, *args, **kwargs):
        election = self.get_object()
        data = {"election": election.id, "results": election.results}
        return Response(data=data, status=status.HTTP_200_OK)


"""
class CreateBallotView(generics.CreateAPIView):
    queryset = Ballot.objects.all()
    serializer_class = BallotSerializer
    permission_classes = (BallotPermission,)

    def get_election_or_404(self, **kwargs):
        request_election = Election.objects.filter(pk=kwargs.get("election_pk"))

        if not request_election.exists():
            raise NotFound("Election not found.")

        return request_election[0]

    def create(self, request, *args, **kwargs):
        election = self.get_election_or_404(**kwargs)

        # Serialize the data.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if the new Ballot object is valid.
        choice_names = [
            c[0] for c in Choice.objects.filter(election=election).values_list("name")
        ]
        for choice in serializer.validated_data["choices"]:
            if choice.name not in choice_names:
                raise ValidationError("Invalid choices provided.")

        if len(serializer.validated_data["choices"]) > election.max_choices_per_ballot:
            raise ValidationError("Too many choices.")

        # Check if the election is active.
        if not election.is_active:
            raise PermissionDenied("This election is not active.")

        # Check if the user is allowed to vote.
        if request.user.id not in [
            voter[0] for voter in election.registered_voters.values_list("id")
        ]:
            raise PermissionDenied("You are not allowed to vote.")

        # Check if the user has already voted.
        if request.user.id in [voter[0] for voter in election.voters.values_list("id")]:
            raise PermissionDenied("You have already voted.")

        # Save the object.
        serializer.save(election=election)
        headers = self.get_success_headers(serializer.data)

        # Add the voter to the Election object.
        election.voters.add(request.user)

        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
"""
