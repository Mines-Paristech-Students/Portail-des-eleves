from rest_framework import serializers

from associations.models import Folder, File
from associations.serializers import AssociationsShortSerializer


class FolderShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ("id", "name")


class FolderSerializer(serializers.ModelSerializer):
    association = AssociationsShortSerializer()
    parent = FolderShortSerializer()
    children = FolderShortSerializer()

    class Meta:
        model = Folder
        fields = ("id", "name", "parent", "children", "association")


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ("id", "name", "description", "association", "file", "folder", "uploaded_on", "uploaded_by")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)
        res["filiation"] = []

        folder = instance.folder
        while folder is not None:
            res["filiation"].append(folder.name)
            folder = folder.folder

        return res
