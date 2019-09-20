from django.db.models import Q

from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.response import Response

from associations.models import Election, Choice, Ballot
from associations.permissions import ElectionPermission, BallotPermission, ResultsPermission
from associations.serializers import ElectionSerializer, BallotSerializer

"""
    Endpoints:
        * List elections:               GET     /associations/elections/
        * Retrieve an election:         GET     /associations/elections/1/
        * Create an election:           POST    /associations/elections/1/
        * Update an election:           PATCH   /associations/elections/1/
        * Destroy an election:          DELETE  /associations/elections/1/
        * Vote to an election:          POST    /associations/elections/1/vote/
        * Results of an election:       GET     /associations/elections/1/results/
"""


class ElectionViewSet(viewsets.ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    permission_classes = (ElectionPermission,)

    @action(detail=True, methods=('get',), permission_classes=(ResultsPermission,))
    def results(self, *args, **kwargs):
        election = self.get_object()
        data = {'election': election.id, 'results': election.results}
        return Response(data=data, status=status.HTTP_200_OK)


class CreateBallotView(generics.CreateAPIView):
    """This view deals with the news filtered by subscriptions."""

    queryset = Ballot.objects.all()
    serializer_class = BallotSerializer
    permission_classes = (BallotPermission,)

    def get_election_or_404(self, **kwargs):
        request_election = Election.objects.filter(pk=kwargs.get('election_pk', None))

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
