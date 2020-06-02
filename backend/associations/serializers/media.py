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

    def to_representation(self, instance):
        res = super(MediaSerializer, self).to_representation(instance)

        # Convert the server URI to an absolute URL
        # ie /media/file.txt -> https://domain.name/media.file.txt
        request = self.context["request"]
        if request:
            host = request.get_host()
            res["url"] = f"{'https' if request.is_secure() else 'http'}://{host}{res['url']}"

        return res
