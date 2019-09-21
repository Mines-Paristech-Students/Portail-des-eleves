import django_filters
from django.http import HttpResponseBadRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status

from tags.models import Namespace, Tag
from tags.permissions import NamespacePermission
from tags.serializers import NamespaceSerializer, TagSerializer

"""

To create a namespace : 
- either be an admin and create a global scope
- either specify a scope and a scoped_to and have permissions on the scoped_to object

"""


class NamespaceViewSet(viewsets.ModelViewSet):
    queryset = Namespace.objects.all()
    serializer_class = NamespaceSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('scope', 'scoped_to')
    permission_classes = (NamespacePermission,)

    def create(self, request, *args, **kwargs):
        # Required since we use "unique_together"
        if "scoped_to" not in request.data:
            request.data["scoped_to"] = ""
            
        return super(NamespaceViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if "scope" in request.data or "scoped_to" in request.data:
            return HttpResponseBadRequest("Cannot change scope of a namespace")
        
        return super(NamespaceViewSet, self).update(request, *args, **kwargs)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
