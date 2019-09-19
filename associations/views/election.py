from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from associations.models import Association, Election
from associations.permissions import ElectionPermission, VotePermission, ResultsPermission
from associations.serializers import ElectionSerializer, ElectionAdminSerializer, VoteSerializer
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
        if self.action in ('vote',):
            return VoteSerializer

        role = self.request.user.get_role(association_pk=self.kwargs['association_pk'])

        if role and role.election:
            return ElectionAdminSerializer
        else:
            return ElectionSerializer

    def get_permissions(self):
        if self.action in ('vote',):
            return VotePermission(),
        elif self.action in ('results',):
            return ResultsPermission(),
        else:
            return ElectionPermission(),

    @action(detail=True, methods=('post',))
    def vote(self, request, pk, association_pk):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        election = self.get_object()

        # Save the new Vote object in the database.
        serializer.save(election=election)
        headers = self.get_success_headers(serializer.data)

        # Add the voter to the Election object.
        election.voters.add(request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=('get',))
    def results(self, request, pk, association_pk):
        election = self.get_object()
        data = {'election': election.id, 'results': election.results}
        return Response(data=data, status=status.HTTP_200_OK)
