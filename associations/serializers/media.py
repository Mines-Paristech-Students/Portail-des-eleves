import mimetypes

from rest_framework import serializers

from associations.models import Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = (
            "id",
            "name",
            "description",
            "association",
            "file",
            "uploaded_on",
            "uploaded_by",
        )
        read_only_fields = ("uploaded_on", "uploaded_by", "file")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)

        mimetype = mimetypes.guess_type(instance.file.name)

        type = [x for x in mimetype if x is not None]
        if len(type) > 0:
            res["type"] = type[0]
        else:
            res["type"] = None

        return res


class SubmitMediaSerializer(serializers.ModelSerializer):
    """An user submitting a media should only submit the name, the description, the association and the file."""

    class Meta:
        model = Media
        fields = ("id", "name", "description", "association", "file")

    def create(self, validated_data):
        file_data = validated_data
        file_data["uploaded_by"] = self.context["request"].user

        # Create the new file
        file = Media.objects.create(**file_data)
        file.save()

        return file
