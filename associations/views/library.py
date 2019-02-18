from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from associations.models import Library
from associations.serializers import LibrarySerializer
from associations.permissions import IsAssociationMember

class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = (IsAssociationMember,)
