from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from associations.models import Association, News
from associations.permissions import NewsPermission
from associations.serializers import NewsSerializer
from associations.views import AssociationNestedViewSet

from subscriptions.models import AssociationSubscription


class TimelinePagination(PageNumberPagination):
    page_size = 2
    max_page_size = 10
    page_size_query_param = 'page_size'


class NewsAssociationViewSet(AssociationNestedViewSet):
    """This view deals with the news linked to a specific association."""

    queryset = News.objects.all()
    serializer_class = NewsSerializer
    pagination_class = TimelinePagination
    permission_classes = (NewsPermission,)

    def get_queryset(self):
        return News.objects.filter(association=self.kwargs['association_pk'])

    def perform_update(self, serializer):
        serializer.save(association=Association.objects.get(pk=self.kwargs['association_pk']))

    def perform_create(self, serializer):
        serializer.save(association=Association.objects.get(pk=self.kwargs['association_pk']),
                        author=self.request.user)


class NewsSubscriptionsViewSet(generics.ListAPIView):
    """This view deals with the news filtered by subscriptions."""

    queryset = News.objects.all()
    serializer_class = NewsSerializer
    pagination_class = TimelinePagination

    def get_queryset(self):
        subscriptions = AssociationSubscription.objects.filter(user=self.request.user).values_list('association')
        return News.objects.all().filter(association__in=subscriptions)
