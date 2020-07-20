from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from associations.models import Page
from associations.permissions import PagePermission
from associations.serializers import PageSerializer
from tags.filters import HasHiddenTagFilter


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = (PagePermission,)

    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
        HasHiddenTagFilter,
    )  # SearchFilter is not enabled by default.
    filter_fields = ("association_id", "page_type", "title")
    ordering_fields = ("creation_date", "last_update_date")
    search_fields = (
        "title",
        "text",
        "authors__first_name",
        "authors__last_name",
        "authors__id",
    )

    def perform_create(self, serializer):
        # Send the current user to the serializer so they can be added to the authors.
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        # Send the current user to the serializer so they can be added to the authors.
        serializer.save(author=self.request.user)
