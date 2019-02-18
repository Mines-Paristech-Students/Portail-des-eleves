from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework import status
from rest_framework_bulk.generics import BulkModelViewSet

from associations.models import Role
from associations.models import Association
from associations.serializers import AssociationsShortSerializer, AssociationsSerializer, RoleSerializer, RoleShortSerializer
from associations.permissions import IsAssociationMember

class RoleViewSet(BulkModelViewSet):
    queryset = Role.objects.all()
    model = Role
    permission_classes = (IsAssociationMember,)

    def get_queryset(self):
        queryset = Role.objects.all()
        association_name = self.request.query_params.get('association', None)
        if association_name is not None:
            queryset = queryset.filter(association=association_name)
        return queryset

    def get_serializer_class(self):
        if self.action == 'list' and self.request.query_params.get('association') is None:
            return RoleShortSerializer
        else:
            return RoleSerializer

    def allow_bulk_destroy(self, qs, filtered):
        return False

class AssociationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows association to be viewed or edited.
    """
    queryset = Association.objects.all()
    serializer_class = AssociationsSerializer
    permission_classes = (IsAssociationMember,)

    action_serializers = {
        'retrieve': AssociationsSerializer,
        'list': AssociationsShortSerializer,
    }

    def get_serializer_class(self):

        if hasattr(self, 'action_serializers'):
            if self.action in self.action_serializers:
                return self.action_serializers[self.action]

        return super(AssociationViewSet, self).get_serializer_class()
