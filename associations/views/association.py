from rest_framework import viewsets

from associations.models import Group
from associations.models.association import Association
from associations.serializers import AssociationsShortSerializer, AssociationsSerializer, GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    def get_queryset(self):
        queryset = Group.objects.all()
        association_name = self.request.query_params.get('association', None)
        if association_name is not None:
            queryset = queryset.filter(association=association_name)
        return queryset


class AssociationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows association to be viewed or edited.
    """
    queryset = Association.objects.all()
    serializer_class = AssociationsSerializer

    action_serializers = {
        'retrieve': AssociationsSerializer,
        'list': AssociationsShortSerializer,
    }

    def get_serializer_class(self):

        if hasattr(self, 'action_serializers'):
            if self.action in self.action_serializers:
                return self.action_serializers[self.action]

        return super(AssociationViewSet, self).get_serializer_class()
