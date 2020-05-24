import django_filters
from rest_framework import status
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from associations.models import Media
from associations.permissions import CanEditMedia
from associations.serializers.media import MediaSerializer, SubmitMediaSerializer
from tags.filters.taggable import TaggableFilter


class MediaFilter(TaggableFilter):
    class Meta:
        model = Media
        fields = ("association",)


class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer

    filter_class = MediaFilter
    parser_classes = (MultiPartParser,)
    permission_classes = (CanEditMedia,)

    def create(self, request, *args, **kwargs):
        serializer = SubmitMediaSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
