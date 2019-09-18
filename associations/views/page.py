from associations.models import Association, Page
from associations.serializers import PageSerializer
from associations.permissions import PagePermission
from associations.views import AssociationNestedViewSet


class PageViewSet(AssociationNestedViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = (PagePermission,)

    def get_queryset(self):
        return Page.objects.filter(association=self.kwargs['association_pk'])

    def perform_update(self, serializer):
        serializer.save(association=Association.objects.get(pk=self.kwargs['association_pk']))

    def perform_create(self, serializer):
        serializer.save(association=Association.objects.get(pk=self.kwargs['association_pk']))
