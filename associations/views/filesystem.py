from django.http import JsonResponse
from rest_framework import viewsets
from django_filters import rest_framework as filters
from rest_framework.views import APIView

from associations.models import Folder, File
from associations.serializers.filesystem import FolderSerializer, FileSerializer


class FileSystemView(APIView):
    def get(self, request, association_id, format=None):
        folders = Folder.objects.filter(association__id=association_id, parent=None)
        files = File.objects.filter(association__id=association_id, folder=None)

        return JsonResponse({
            "name": association_id,
            "children": FolderSerializer(many=True).to_representation(folders),
            "files": FileSerializer(many=True).to_representation(files)
        })


class FolderViewSet(viewsets.ModelViewSet):
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer

    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ("association", "parent")


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ("association", "folder")
