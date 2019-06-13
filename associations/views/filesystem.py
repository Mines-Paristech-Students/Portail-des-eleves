from django.http import JsonResponse
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from associations.models import Folder, File
from associations.serializers.filesystem import FolderSerializer, FileSerializer, SubmitFileSerializer


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

    parser_classes = (MultiPartParser,)

    def create(self, request, *args, **kwargs):
        serializer = SubmitFileSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

