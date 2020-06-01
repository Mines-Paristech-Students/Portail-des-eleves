import magic
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, JSONParser

from associations.models import Media, Association
from associations.permissions import CanEditMedia
from associations.serializers.media import MediaSerializer
from tags.filters.taggable import TaggableFilter


class MediaFilter(TaggableFilter):
    class Meta:
        model = Media
        fields = ("association",)


class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    filter_class = MediaFilter
    parser_classes = (MultiPartParser, JSONParser)
    permission_classes = (CanEditMedia,)

    def perform_create(self, serializer):
        association = Association.objects.get(pk=self.request.data["association"])

        media = serializer.save(
            uploaded_by=self.request.user,
            association=association,
            file=self.request.data["file"],
        )

        try:
            mime = magic.Magic(mime=True)
            media.mimetype = mime.from_file(media.file.path)
            media.save()
        except FileNotFoundError as e:
            media.delete()
            raise e
