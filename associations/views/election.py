from rest_framework import generics, status
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.response import Response

from associations.models import Association, Election, Choice, Ballot
from associations.permissions import ElectionPermission, BallotPermission, ResultsPermission
from associations.serializers import ElectionSerializer, ElectionAdminSerializer, BallotSerializer
from associations.views import AssociationNestedViewSet

"""
    Endpoints:
        * List:     GET     /associations/bde/elections/
        * Retrieve: GET     /associations/bde/elections/1/
        * Create:   POST    /associations/bde/elections/1/
        * Update:   PATCH   /associations/bde/elections/1/
        * Destroy:  DELETE  /associations/bde/elections/1/
        * Vote:     POST    /associations/bde/elections/1/vote/
        * Results:  GET     /associations/bde/elections/1/results/
"""


class ElectionViewSet(AssociationNestedViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    permission_classes = (ElectionPermission,)

    def get_queryset(self):
        return Election.objects.filter(association=self.kwargs['association_pk'])

    def get_serializer_class(self):
        role = self.request.user.get_role(self.kwargs['association_pk'])

        if role and role.election:
            return ElectionAdminSerializer
        else:
            return ElectionSerializer

    def get_permissions(self):
        if self.action in ('results',):
            return ResultsPermission(),
        else:
            return ElectionPermission(),

    def perform_create(self, serializer):
        serializer.save(association=Association.objects.get(pk=self.kwargs['association_pk']))

    def perform_update(self, serializer):
        serializer.save(association=Association.objects.get(pk=self.kwargs['association_pk']))

    @action(detail=True, methods=('get',))
    def results(self, request, pk, association_pk):
        election = self.get_object()
        data = {'election': election.id, 'results': election.results}
        return Response(data=data, status=status.HTTP_200_OK)


class CreateBallotView(generics.CreateAPIView):
    """This view deals with the news filtered by subscriptions."""

    queryset = Ballot.objects.all()
    serializer_class = BallotSerializer
    permission_classes = (BallotPermission,)

    def get_election_or_404(self, **kwargs):
        request_association = Association.objects.filter(pk=kwargs.get('association_pk', None))
        if not request_association.exists():
            raise NotFound('Association not found.')

        request_election = Election.objects.filter(pk=kwargs.get('election_pk', None),
                                                   association=kwargs.get('association_pk', None))
        if not request_election.exists():
            raise NotFound('Election not found.')

        return request_election[0]

    def create(self, request, *args, **kwargs):
        election = self.get_election_or_404(**kwargs)

        # Serialize the data.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if the new Ballot object is valid.
        choice_names = [c[0] for c in Choice.objects.filter(election=election).values_list('name')]
        for choice in serializer.validated_data['choices']:
            if choice.name not in choice_names:
                raise ValidationError('Invalid choices provided.')

        if len(serializer.validated_data['choices']) > election.max_choices_per_ballot:
            raise ValidationError('Too many choices.')

        # Check if the election is active.
        if not election.is_active:
            raise PermissionDenied('This election is not active.')

        # Check if the user is allowed to vote.
        if request.user.id not in [voter[0] for voter in election.registered_voters.values_list('id')]:
            raise PermissionDenied('You are not allowed to vote.')

        # Check if the user has already voted.
        if request.user.id in [voter[0] for voter in election.voters.values_list('id')]:
            raise PermissionDenied('You have already voted.')

        # Save the object.
        serializer.save(election=election)
        headers = self.get_success_headers(serializer.data)

        # Add the voter to the Election object.
        election.voters.add(request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)