from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets
from rest_framework_bulk.generics import BulkModelViewSet
from rest_framework.exceptions import PermissionDenied, NotFound
from url_filter.integrations.drf import DjangoFilterBackend

from associations.models import Association
from associations.models import Role
from associations.permissions import AssociationPermission, RolePermission
from associations.serializers import AssociationShortSerializer, AssociationSerializer, RoleSerializer, \
    RoleShortSerializer, WriteRoleSerializer


class RoleViewSet(BulkModelViewSet):
    queryset = Role.objects.all()
    model = Role
    permission_classes = (RolePermission,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('user', 'association')

    def get_write_role_serializer(self, association, *args, **kwargs):
        """Given an association, return the good WriteRoleSerializer, depending on the permissions of the user."""

        role = self.request.user.get_role(association)

        if role and role.administration:
            return WriteRoleSerializer(True, *args, **kwargs)
        elif self.request.user.is_staff:
            return WriteRoleSerializer(False, *args, **kwargs)
        else:
            raise PermissionDenied('You are not allowed to write to this role.')

    def get_serializer(self, *args, **kwargs):
        if self.action in ('create',):
            association_id = self.request.data.get('association', None)

            try:
                association = Association.objects.get(pk=association_id)
            except ObjectDoesNotExist:
                raise NotFound(f'The Association {association_id} does not exist.')

            return self.get_write_role_serializer(association, *args, **kwargs)
        elif self.action in ('update', 'partial_update',):
            association = self.get_object().association
            return self.get_write_role_serializer(association, *args, **kwargs)
        elif self.action in ('list',):
            return RoleShortSerializer(*args, **kwargs)
        else:
            return RoleSerializer(*args, **kwargs)


class AssociationViewSet(viewsets.ModelViewSet):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer
    permission_classes = (AssociationPermission,)

    def get_serializer_class(self):
        if self.action in ('list',):
            return AssociationShortSerializer
        else:
            return AssociationSerializer
