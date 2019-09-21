from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework_bulk.generics import BulkModelViewSet
from url_filter.integrations.drf import DjangoFilterBackend

from associations.models import Association
from associations.models import Role
from associations.permissions import AssociationPermission, RolePermission
from associations.serializers import AssociationShortSerializer, AssociationSerializer, RoleSerializer, \
    RoleShortSerializer


class RoleViewSet(BulkModelViewSet):
    queryset = Role.objects.all()
    model = Role
    permission_classes = (RolePermission,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('user', 'association')

    def get_serializer_class(self):
        if self.action in ('list',):
            return RoleShortSerializer
        else:
            return RoleSerializer


class AssociationViewSet(viewsets.ModelViewSet):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer
    permission_classes = (AssociationPermission,)

    def get_serializer_class(self):
        if self.action in ('list',):
            return AssociationShortSerializer
        else:
            return AssociationSerializer


# TODO: remove this after the merge with 17wf/rewriteAssociationsUrls.
def association_exists_or_404(func):
    def wrapper(self, *args, **kwargs):
        if not Association.objects.filter(pk=self.kwargs['association_pk']).exists():
            raise NotFound('Association not found.')

        return func(self, *args, **kwargs)

    return wrapper


# TODO: remove this after the merge with 17wf/rewriteAssociationsUrls.
class AssociationNestedViewSet(viewsets.ModelViewSet):
    """
        All the ViewSets having a base URL like /associations/association_pk/events/… should inherit from this class,
        which ensures that providing a non-existing association_pk will raise a 404.\n
        Moreover, these ViewSets should be provided a kwargs argument with a key 'association_pk' (a convenient way to
        have it is by using rest_framework_nested.routers.NestedSimpleRouter).
    """

    create = association_exists_or_404(viewsets.ModelViewSet.create)
    retrieve = association_exists_or_404(viewsets.ModelViewSet.retrieve)
    list = association_exists_or_404(viewsets.ModelViewSet.list)
    update = association_exists_or_404(viewsets.ModelViewSet.update)
    partial_update = association_exists_or_404(viewsets.ModelViewSet.partial_update)
    destroy = association_exists_or_404(viewsets.ModelViewSet.destroy)
