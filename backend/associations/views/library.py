from django import http
from django.db.models import Q
from django_filters.rest_framework import (
    DjangoFilterBackend,
    FilterSet,
    MultipleChoiceFilter,
)
from rest_framework import filters, status, viewsets
from rest_framework.response import Response

from associations.models import Library, Loan, Loanable
from associations.permissions import (
    LibraryPermission,
    LoanablePermission,
    LoansPermission,
)
from associations.serializers import (
    LibrarySerializer,
    LibraryWriteSerializer,
    CreateLoanSerializer,
    UpdateLoanSerializer,
    LoanSerializer,
    LoanableSerializer,
)
from tags.filters import HasHiddenTagFilter


class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = (LibraryPermission,)

    def get_queryset(self):
        """The user has access to the enabled libraries and to every library they are a library administrator of."""

        # The libraries for which the user is library administrator.
        libraries_id = [
            role.association.library.id
            for role in self.request.user.roles.all()
            if role.library
        ]

        return Library.objects.filter(Q(enabled=True) | Q(id__in=libraries_id))

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return LibraryWriteSerializer

        return LibrarySerializer


class LoanableFilter(FilterSet):
    status = MultipleChoiceFilter(
        choices=(
            ("AVAILABLE", "AVAILABLE"),
            ("BORROWED", "BORROWED"),
            ("REQUESTED", "REQUESTED"),
        ),
        method="filter_status",
    )

    class Meta:
        model = Loanable
        fields = ("status", "library")

    def filter_status(self, queryset, _, filter):
        """Filter by AVAILABLE, BORROWED or REQUESTED.
        Here, AVAILABLE means that there are no PENDING loans linked to the loanable.
        Otherwise, the status is REQUESTED."""

        # No filter or every filter.
        if len(filter) == 0 or len(filter) == 3:
            return queryset

        ids = set()

        if "AVAILABLE" in filter:
            ids.update(
                [
                    x.id
                    for x in queryset
                    if x.is_available() and x.number_of_pending_loans == 0
                ]
            )

        if "BORROWED" in filter:
            ids.update([x.id for x in queryset if not x.is_available()])

        if "REQUESTED" in filter:
            ids.update(
                [
                    x.id
                    for x in queryset
                    if x.is_available() and x.number_of_pending_loans > 0
                ]
            )

        return queryset.filter(pk__in=ids)


class LoanableViewSet(viewsets.ModelViewSet):
    queryset = Loanable.objects.all()
    serializer_class = LoanableSerializer
    permission_classes = (LoanablePermission,)

    ordering = ("name", "comment")
    search_fields = ("name", "description")
    filterset_class = LoanableFilter
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
        HasHiddenTagFilter,
    )  # SearchFilter is not enabled by default.

    def get_queryset(self):
        """The user has access to the loanables coming from every enabled library and to the loanables of every
        library they are a library administrator of."""

        # The libraries for which the user is library administrator.
        libraries = [
            role.association.library
            for role in self.request.user.roles.all()
            if role.library
        ]

        return Loanable.objects.filter(
            Q(library__enabled=True) | Q(library__in=libraries)
        )


class LoansViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    permission_classes = (LoansPermission,)

    filter_fields = ("status", "user", "loan_date", "loanable__library__id")
    ordering = ("loan_date",)

    @classmethod
    def get_field_from_data_or_instance(cls, field, data, instance, default=None):
        """If the field is in data, return it; otherwise, if the field is in instance, return it; otherwise,
        return None."""
        return data.get(field, getattr(instance, field, default))

    @classmethod
    def check_date_consistency_against_instance(cls, data, instance):
        loan_date = cls.get_field_from_data_or_instance("loan_date", data, instance)
        real_return_date = cls.get_field_from_data_or_instance(
            "real_return_date", data, instance
        )
        expected_return_date = cls.get_field_from_data_or_instance(
            "expected_return_date", data, instance
        )

        if loan_date and expected_return_date:
            if loan_date >= expected_return_date:
                return False
        if loan_date and real_return_date:
            if loan_date >= real_return_date:
                return False

        return True

    @classmethod
    def check_status_consistency_against_instance(cls, data, instance: Loan, user):
        user_role = user.get_role(instance.loanable.library.association)
        user_is_library_admin = user_role is not None and user_role.library

        if user_is_library_admin:
            return True
        else:
            # The user is not a library admin: they are only allowed to change the status of their loan from PENDING
            # to CANCELLED.
            if "status" in data:
                if instance.status == data["status"] or (
                    instance.status == "PENDING" and data["status"] == "CANCELLED"
                ):
                    return True

        return False

    @classmethod
    def check_date_permission_against_instance(cls, data, instance, user):
        """If the user is not a library admin, they are not allowed to changed the dates of the Loan."""

        user_role = user.get_role(instance.loanable.library.association)
        user_is_library_admin = user_role is not None and user_role.library

        if user_is_library_admin:
            return True
        else:
            if (
                "loan_date" not in data
                and "expected_return_date" not in data
                and "real_return_date" not in data
            ):
                return True

        return False

    def get_serializer_class(self):
        if self.action in ("create",):
            return CreateLoanSerializer
        elif self.action in ("update", "partial_update"):
            return UpdateLoanSerializer
        else:
            return LoanSerializer

    def get_queryset(self):
        """The user has access to their loans coming from an enabled library and to the loans of every library they are
        a library administrator of."""

        # The library for which the user is library administrator.
        libraries = [
            role.association.library
            for role in self.request.user.roles.all()
            if role.library
        ]

        q = Loan.objects.filter(
            (Q(user=self.request.user) & Q(loanable__library__enabled=True))
            | Q(loanable__library__in=libraries)
        )
        return q

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        loanable = Loanable.objects.get(pk=serializer.validated_data["loanable"].id)

        # Check whether the loanable is already borrowed.
        if loanable.is_borrowed():
            return http.HttpResponseBadRequest("The object is already borrowed.")

        # Check whether the loanable already has a pending request from this user.
        if Loan.objects.filter(
            user=request.data["user"],
            loanable=request.data["loanable"],
            status="PENDING",
        ):
            return http.HttpResponseBadRequest(
                "This user already has a pending request for this loanable."
            )

        # Check whether the user can create a Loan for another user.
        user_role = request.user.get_role(loanable.library.association)
        user_is_library_admin = user_role is not None and user_role.library

        if not user_is_library_admin:
            if serializer.validated_data["user"].id != request.user.id:
                return http.HttpResponseForbidden(
                    "Cannot create a Loan for another user."
                )

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if not self.check_date_consistency_against_instance(
            serializer.validated_data, instance
        ):
            return http.HttpResponseBadRequest(
                "The provided dates are inconsistent with the updated Loan."
            )

        if not self.check_status_consistency_against_instance(
            serializer.validated_data, instance, request.user
        ):
            return http.HttpResponseForbidden(
                "You are not allowed to change the status of this loan."
            )

        if not self.check_date_permission_against_instance(
            serializer.validated_data, instance, request.user
        ):
            return http.HttpResponseForbidden(
                "You are not allowed to change the dates of this loan."
            )

        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
