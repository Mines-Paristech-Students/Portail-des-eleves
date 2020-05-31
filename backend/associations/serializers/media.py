from rest_framework import serializers

from associations.models import Media
from tags.serializers import TagSerializer


class MediaSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Media
        read_only_fields = (
            "id",
            "uploaded_on",
            "uploaded_by",
            "url",
            "association",
            "mimetype",
            "tags",
        )
        fields = read_only_fields + ("name", "description")
