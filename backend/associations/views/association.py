from datetime import date

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django_filters import DateTimeFromToRangeFilter
from django_filters.rest_framework import FilterSet, CharFilter, MultipleChoiceFilter
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response

from associations.models import Association
from associations.models import Role
from associations.permissions import AssociationPermission, RolePermission
from associations.serializers import (
    AssociationShortSerializer,
    AssociationSerializer,
    RoleSerializer,
    WriteRoleSerializer,
)
from associations.serializers.association import AssociationLogoSerializer


class RoleFilter(FilterSet):
    start_date = DateTimeFromToRangeFilter()
    end_date = DateTimeFromToRangeFilter()
    is_active = CharFilter(method="filter_is_active")

    class Meta:
        model = Role
        fields = ("start_date", "end_date", "user", "association", "is_active")

    def filter_is_active(self, queryset, _, value):
        condition = Q(start_date__lte=date.today()) & (
            Q(end_date__isnull=True) | Q(end_date__gt=date.today())
        )

        if value.lower() == "true" or len(value) == 0:
            return queryset.filter(condition)
        else:
            return queryset.exclude(condition)


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = (RolePermission,)
    filterset_class = RoleFilter
    ordering_fields = (
        "user__first_name",
        "user__last_name",
        "role",
        "rank",
        "start_date",
        "end_date",
    )

    def get_write_role_serializer(self, association, *args, **kwargs):
        """Given an association, return the good WriteRoleSerializer, depending on the permissions of the user."""

        role = self.request.user.get_role(association)

        if role and role.administration:
            return WriteRoleSerializer(True, *args, **kwargs)
        elif self.request.user.is_staff:
            return WriteRoleSerializer(False, *args, **kwargs)
        else:
            raise PermissionDenied("You are not allowed to write to this role.")

    def get_serializer(self, *args, **kwargs):
        if self.action in ("create",):
            association_id = self.request.data.get("association", None)

            try:
                association = Association.objects.get(pk=association_id)
            except ObjectDoesNotExist:
                raise NotFound(f"The Association {association_id} does not exist.")

            return self.get_write_role_serializer(association, *args, **kwargs)
        elif self.action in ("update", "partial_update"):
            association = self.get_object().association
            return self.get_write_role_serializer(association, *args, **kwargs)
        else:
            return RoleSerializer(*args, **kwargs)


class AssociationViewSet(viewsets.ModelViewSet):
    queryset = Association.objects.all()
    serializer_class = AssociationSerializer
    permission_classes = (AssociationPermission,)

    def get_serializer_class(self):
        if self.action in ("list",):
            return AssociationShortSerializer
        else:
            return AssociationSerializer


@api_view(["PUT"])
def set_association_logo(request, association_pk):
    association = Association.objects.get(pk=association_pk)
    role = request.user.get_role(association)
    if not (role and role.administration):
        raise PermissionDenied()

    serializer = AssociationLogoSerializer(data=request)
    serializer.is_valid(raise_exception=True)
    serializer.update(association, serializer.validated_data)

    return Response(status=204)
