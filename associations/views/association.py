from rest_framework import viewsets

from associations.models.association import Association, Permission
from associations.serializers import AssociationsShortSerializer, AssociationsSerializer, PermissionSerializer


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


class PermissionViewSet(viewsets.ModelViewSet):

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

