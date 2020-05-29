import mimetypes

from rest_framework import serializers
from associations.models import Media


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        read_only_fields = ("id", "uploaded_on", "uploaded_by", "file", "association")
        fields = read_only_fields + ("name", "description")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)

        mimetype = mimetypes.guess_type(instance.file.name)

        type = [x for x in mimetype if x is not None]
        if len(type) > 0:
            res["type"] = type[0]
        else:
            res["type"] = None

        return res
