from rest_framework import viewsets

from associations.models import Library
from associations.serializers import LibrarySerializer


class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
