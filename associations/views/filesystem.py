from django.db import transaction
from django.http import JsonResponse
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from associations.models import Folder, File
from associations.permissions import IsAssociationMember, CanEditFiles
from associations.serializers.filesystem import FolderSerializer, FileSerializer, SubmitFileSerializer


class FileSystemView(APIView):

    permission_classes = (CanEditFiles,)

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

    permission_classes = (CanEditFiles,)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        files = File.objects.filter(folder=instance)
        children = Folder.objects.filter(parent=instance)

        parent = instance.parent

        with transaction.atomic():
            for f in files:
                f.folder = parent
                f.save()

            for c in children:
                c.parent = parent
                c.save()

            self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ("association", "folder")

    parser_classes = (MultiPartParser,)

    permission_classes = (CanEditFiles,)

    def create(self, request, *args, **kwargs):
        serializer = SubmitFileSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

