from rest_framework import viewsets

from associations.models import Page
from associations.permissions import PagePermission
from associations.serializers import PageSerializer


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = (PagePermission,)

    def perform_create(self, serializer):
        # Send the current user to the serializer so they can be added to the authors.
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        # Send the current user to the serializer so they can be added to the authors.
        serializer.save(author=self.request.user)
