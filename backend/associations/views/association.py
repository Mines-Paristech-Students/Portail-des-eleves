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
from authentication.models import User


class RoleFilter(FilterSet):
    start_date = DateTimeFromToRangeFilter()
    end_date = DateTimeFromToRangeFilter()
    is_active = CharFilter(method="filter_is_active")
    permission = MultipleChoiceFilter(
        choices=zip(Role.PERMISSION_NAMES, Role.PERMISSION_NAMES),
        method="filter_permission",
    )

    class Meta:
        model = Role
        fields = (
            "start_date",
            "end_date",
            "user",
            "association",
            "is_active",
            "permission",
        )

    def filter_is_active(self, queryset, _, value):
        condition = Q(start_date__lte=date.today()) & (
            Q(end_date__isnull=True) | Q(end_date__gt=date.today())
        )

        if value.lower() == "true" or len(value) == 0:
            return queryset.filter(condition)
        else:
            return queryset.exclude(condition)

    def filter_permission(self, queryset, _, permissions_filter):
        """Filter by active permission."""

        # No filter or every filter.
        if (
            len(permissions_filter) == 0
            or len(permissions_filter) == Role.PERMISSION_NAMES
        ):
            return queryset

        # Looks like the canonical way to get an "always False" condition:
        # https://stackoverflow.com/questions/35893867/always-false-q-object
        condition = Q(pk__in=[])

        for permission_name in Role.PERMISSION_NAMES:
            if permission_name in permissions_filter:
                condition |= Q(
                    **{
                        f"{permission_name}_permission": True,
                        "start_date__lte": date.today(),
                    }
                ) & (Q(end_date__isnull=True) | Q(end_date__gt=date.today()))

        return queryset.filter(condition).distinct()


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

    ordering_fields = ("rank", "name")

    def get_serializer_class(self):
        if self.action in ("list",):
            return AssociationShortSerializer
        else:
            return AssociationSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        user = User.objects.get(pk=request.user.id)

        if user.is_in_first_year:
            queryset = queryset.filter(is_hidden=False)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
