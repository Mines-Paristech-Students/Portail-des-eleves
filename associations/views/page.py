from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from associations.models import Page
from associations.serializers import PageSerializer
from associations.permissions import CanEditStaticPage

class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer
    permission_classes = (IsAdminUser|(IsAuthenticated & CanEditStaticPage),)

    def get_queryset(self):
        queryset = Page.objects.all()
        association_name = self.request.query_params.get('association', None)
        if association_name is not None:
            queryset = queryset.filter(association=association_name)
        return queryset
