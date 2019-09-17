from django.http.response import Http404

from url_filter.integrations.drf import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework_bulk.generics import BulkModelViewSet

from associations.models import Role
from associations.models import Association
from associations.serializers import AssociationsShortSerializer, AssociationsSerializer, \
    RoleSerializer, RoleShortSerializer
from associations.permissions import IsAssociationMember, IsAssociationAdminOrReadOnly


class RoleViewSet(BulkModelViewSet):
    queryset = Role.objects.all()
    model = Role
    permission_classes = (IsAssociationAdminOrReadOnly,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('user', 'association')

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


def association_exists_or_404(func):
    def wrapper(self, *args, **kwargs):
        if not Association.objects.filter(pk=self.kwargs['association_pk']).exists():
            raise Http404()

        return func(self, *args, **kwargs)

    return wrapper


class AssociationNestedViewSet(viewsets.ModelViewSet):
    """
        All the ViewSets having a base URL like /associations/association_pk/events/… should inherit from this class,
        which ensures that providing a non-existing association_id will raise a 404.\n
        Moreover, these ViewSets should be provided a kwargs argument with a key 'association_pk' (a convenient way to
        have it is by using rest_framework_nested.routers.NestedSimpleRouter).
    """

    create = association_exists_or_404(viewsets.ModelViewSet.create)
    retrieve = association_exists_or_404(viewsets.ModelViewSet.retrieve)
    list = association_exists_or_404(viewsets.ModelViewSet.list)
    update = association_exists_or_404(viewsets.ModelViewSet.update)
    partial_update = association_exists_or_404(viewsets.ModelViewSet.partial_update)
    destroy = association_exists_or_404(viewsets.ModelViewSet.destroy)
