from rest_framework import viewsets

from associations.models import Page, News
from associations.models.association import Association
from associations.serializers import AssociationsShortSerializer, AssociationsSerializer, NewsSerializer


class AssociationListViewSet(viewsets.ModelViewSet):
    """
    API endpoint that shows a list of associations
    """
    queryset = Association.objects.all()
    serializer_class = AssociationsShortSerializer

class AssociationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows association to be viewed or edited.
    """
    queryset = Association.objects.all()
    serializer_class = AssociationsSerializer


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = NewsSerializer

    def get_queryset(self):

        queryset = Page.objects.all()
        association_name = self.request.query_params.get('association', None)
        if association_name is not None:
            queryset = queryset.filter(association=association_name)
        return queryset


class NewsViewSet(viewsets.ModelViewSet):
    queryset = News.objects.all()
    serializer_class = NewsSerializer

    def get_queryset(self):

        queryset = News.objects.all()
        association_name = self.request.query_params.get('association', None)
        if association_name is not None:
            queryset = queryset.filter(association=association_name)
        return queryset
