from rest_framework import serializers

from associations.models import Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        read_only_fields = (
            "id",
            "uploaded_on",
            "uploaded_by",
            "url",
            "association",
            "mimetype",
        )
        fields = read_only_fields + ("name", "description")
