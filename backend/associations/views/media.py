import magic
from django.db.models import Min, Max
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response

from associations.models import Media, Association
from associations.permissions import CanEditMedia
from associations.serializers.media import MediaSerializer
from tags.filters import HasHiddenTagFilter
from tags.filters.taggable import TaggableFilter


class MediaFilter(TaggableFilter, SearchFilter):
    class Meta:
        model = Media
        fields = {
            "association": ["exact"],
            "uploaded_on": ["exact", "year", "month", "year__in", "month__in"],
            "mimetype": ["exact", "contains"],
        }


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


@api_view(["GET"])
def get_media_uploaded_on_bounds(request, association_pk):
    dates = (
        Media.objects.filter(association=association_pk)
        .values_list("uploaded_on")
        .aggregate(Min("uploaded_on"), Max("uploaded_on"))
    )

    return Response(
        {"min": dates["uploaded_on__min"], "max": dates["uploaded_on__max"]}
    )
