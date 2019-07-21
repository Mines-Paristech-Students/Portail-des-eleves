import mimetypes

from rest_framework import serializers

from associations.models import Folder, File


class FolderShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ("id", "name")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)
        res["number_of_elements"] = instance.children.count() + instance.files.count()

        return res


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ("id", "name", "description", "association", "file", "folder", "uploaded_on", "uploaded_by")
        read_only_fields = ("uploaded_on", "uploaded_by", "file")

    folder = serializers.PrimaryKeyRelatedField(allow_null=True, queryset=Folder.objects.all())

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)

        mimetype = mimetypes.guess_type(instance.file.name)

        type = [x for x in mimetype if x is not None]
        if len(type) > 0:
            res["type"] = type[0]
        else:
            res["type"] = None

        return res


class SubmitFileSerializer(serializers.ModelSerializer):
    """An user submitting a file should only submit the name, the description, the association, the file and
    the folder."""

    class Meta:
        model = File
        fields = (
            'id',
            'name',
            'description',
            'association',
            'file',
            'folder'
        )

    def create(self, validated_data):
        file_data = validated_data
        file_data['uploaded_by'] = self.context['request'].user

        # Create the new file
        file = File.objects.create(**file_data)
        file.save()

        return file


class FolderSerializer(serializers.ModelSerializer):
    children = FolderShortSerializer(many=True, read_only=True)
    files = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Folder
        fields = ("id", "name", "parent", "children", "association", "files")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)
        res["number_of_elements"] = instance.number_of_elements()

        res["filiation"] = []

        folder = instance.parent
        while folder is not None:
            res["filiation"].append({
                "id": folder.id,
                "name": folder.name
            })
            folder = folder.parent

        return res
