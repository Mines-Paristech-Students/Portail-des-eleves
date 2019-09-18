from rest_framework.decorators import action
from rest_framework.response import Response

from associations.models import Election
from associations.permissions import ElectionPermission, VotePermission, ResultsPermission
from associations.serializers import ElectionSerializer, ElectionAdminSerializer
from associations.views import AssociationNestedViewSet


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
        if self.action in ('vote',):
            return VotePermission(),
        elif self.action in ('results',):
            return ResultsPermission(),
        else:
            return ElectionPermission(),

    @action(detail=True, methods=('post',))
    def vote(self, request, pk, association_pk):
        election = self.get_object()

        # TODO: validate posted data, then for each choice create a vote…
        election.voters.add(request.user)
        return Response(data={'election': election.id, 'user': request.user.id})

    @action(detail=True, methods=('get',))
    def results(self, request, pk, association_pk):
        election = self.get_object()
        data = {'election': election.id}
        data.update(election.results)
        return Response(data=data)
