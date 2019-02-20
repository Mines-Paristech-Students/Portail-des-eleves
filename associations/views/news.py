from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated

from associations.models import News
from associations.serializers import NewsSerializer
from associations.permissions import CanEditNews
from subscriptions.models import AssociationSubscription


class TimelinePagination(PageNumberPagination):
    page_size = 2
    max_page_size = 10
    page_size_query_param = 'page_size'


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    pagination_class = TimelinePagination
    permission_classes = (IsAdminUser | (IsAuthenticated & CanEditNews),)

    def get_queryset(self):
        queryset = News.objects.all()
        association_name = self.request.query_params.get('association', None)
        if association_name is not None:
            queryset = queryset.filter(association=association_name)
        else:
            ass_sub = AssociationSubscription.objects.filter(user=self.request.user, subscribed=True).values_list(
                'association')
            queryset = queryset.filter(association__in=ass_sub)
        return queryset
