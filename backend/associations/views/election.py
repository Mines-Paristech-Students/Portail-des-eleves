from django.db import transaction
from django.http import Http404, HttpResponse
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response

from associations.models import Election, Choice, Voter
from associations.permissions.election import (
    VoterPermission,
    ChoicePermission,
    ElectionPermission,
    VotePermission,
)
from associations.serializers.election import (
    ElectionSerializer,
    VoterSerializer,
    ChoiceSerializer,
    VoteSerializer,
)
from associations.serializers.election_read_only import ElectionReadOnlySerializer
from tags.filters import HasHiddenTagFilter


class VoterViewSet(viewsets.ModelViewSet):
    queryset = Voter.objects.all()
    serializer_class = VoterSerializer
    permission_classes = (VoterPermission,)

    filter_fields = ("user", "status", "election", "election__association")

    def get_queryset(self):
        """Filter the results according to the user election permission."""
        return Voter.objects.filter(
            election__association__id__in=self.request.user.get_associations_with_permission(
                "election"
            )
        )

    def perform_create(self, serializer):
        # Check if the user can create the voter.
        role = self.request.user.get_role(
            serializer.validated_data["election"].association
        )
        if not role or not role.election:
            raise PermissionDenied(
                "You are not allowed to create a voter for this election."
            )

        # Only allow creation if the election has not started.
        if serializer.validated_data["election"].started:
            raise ValidationError("The voter cannot be added anymore.")

        serializer.save(status="PENDING")

    def perform_update(self, serializer):
        if not self.get_object().election.started:
            raise ValidationError(
                "The status cannot be updated as the election has not started."
            )

        # The status can only be updated from PENDING.
        if self.get_object().status != "PENDING":
            raise ValidationError("The status cannot be updated anymore.")

        # The status can only be updated to OFFLINE_VOTE (as ONLINE_VOTE is automatically handled).
        if serializer.validated_data["status"] != "OFFLINE_VOTE":
            raise ValidationError(
                "The staff can only update the status to OFFLINE_VOTE."
            )

        # Do not change the user and the election.
        serializer.save(
            user=self.get_object().user, election=self.get_object().election
        )

    def perform_destroy(self, instance: Voter):
        # Only allow deletion if the election has not started.
        if instance.election.started:
            raise ValidationError("The voter cannot be deleted anymore.")

        instance.delete()

    @action(detail=False, methods=("delete",), permission_classes=(VoterPermission,))
    def destroy_from_user_and_election(self, request):
        election_id = request.GET.get("election", "")
        user_id = request.GET.get("user", "")

        try:
            election = Election.objects.get(pk=int(election_id))
            if election.started:
                raise ValidationError("The voter cannot be deleted anymore.")

            voter = self.get_queryset().get(election_id=election_id, user_id=user_id)
            self.perform_destroy(voter)
        except (Election.DoesNotExist, Voter.DoesNotExist):
            raise Http404("No voter found for this election")

        return Response(status=204)


class ChoiceViewSet(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = (ChoicePermission,)

    filter_fields = ("election", "election__association")

    def get_queryset(self):
        """Filter the choices according to the user election permission."""
        return Choice.objects.filter(
            election__association__id__in=self.request.user.get_associations_with_permission(
                "election"
            )
        )

    def perform_create(self, serializer):
        # Check if the user can create the choice.
        role = self.request.user.get_role(
            serializer.validated_data["election"].association
        )
        if not role or not role.election:
            raise PermissionDenied(
                "You are not allowed to create a choice for this election."
            )

        # Only allow creation if the election has not started.
        if serializer.validated_data["election"].started:
            raise ValidationError("The choice cannot be added anymore.")

        serializer.save()

    def perform_update(self, serializer):
        choice = self.get_object()
        override = {"election": choice.election}

        # If the election has started, do not change the name.
        if self.get_object().election.started:
            override["name"] = choice.name

        serializer.save(**override)

    def perform_destroy(self, instance: Choice):
        # Only allow deletion if the election has not started.
        if instance.election.started:
            raise ValidationError("The choice cannot be deleted anymore.")

        instance.delete()


class ElectionFilter(FilterSet):
    class Meta:
        model = Election
        fields = ("association",)


class ElectionViewSet(viewsets.ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionReadOnlySerializer
    permission_classes = (ElectionPermission,)

    filter_class = ElectionFilter
    filter_backends = (DjangoFilterBackend, HasHiddenTagFilter)

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

        override = (
            {
                key: getattr(election, key)
                for key in ("name", "starts_at", "ends_at", "max_choices_per_ballot")
            }
            if election.started
            else {}
        )

        serializer.save(association=election.association, **override)

    def perform_destroy(self, instance: Election):
        # Only allow deletion if the election has not started.
        if instance.started:
            raise ValidationError("The election cannot be deleted anymore.")

        instance.delete()

    @action(detail=True, methods=("put",), permission_classes=(VotePermission,))
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

        # Check if at least one choice but not too many choices have been provided.
        if len(serializer.validated_data["choices"]) > election.max_choices_per_ballot:
            raise ValidationError("Too many choices were provided.")

        if len(serializer.validated_data["choices"]) == 0:
            raise ValidationError("No choice was provided.")

        with transaction.atomic():
            # Update the voter state.
            voter = election.voters.get(user=self.request.user, status="PENDING")
            voter.status = "ONLINE_VOTE"
            voter.save()

            # Update the choices.
            for choice in serializer.validated_data["choices"]:
                choice.number_of_online_votes += 1
                choice.save()

        return Response(
            data={"choices": [c.id for c in serializer.validated_data["choices"]]},
            status=status.HTTP_200_OK,
        )
