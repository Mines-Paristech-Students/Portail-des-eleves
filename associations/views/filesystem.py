from rest_framework import viewsets
from django_filters import rest_framework as filters

from associations.models import Folder, File
from associations.serializers.filesystem import FolderSerializer, FileSerializer


class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ("association",)


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('association',)
