from rest_framework import viewsets

from associations.models.association import Association
from associations.serializers import AssociationsSerializer


class AssociationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user to be viewed or edited.
    """
    queryset = Association.objects.all()
    serializer_class = AssociationsSerializer
