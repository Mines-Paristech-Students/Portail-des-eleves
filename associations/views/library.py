from django.db.models import Q
from django import http

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
from rest_framework import viewsets
from rest_framework.response import Response

from associations.models import Library, Loan, Loanable
from associations.permissions import IfLibraryAdminThenCRUDElseR, IfLibraryAdminThenCRUDElseCRU, \
    IfLibraryEnabledThenCRUDElseLibraryAdminOnlyCRUD
from associations.serializers import LibrarySerializer, CreateLoanSerializer, UpdateLoanSerializer, LoanSerializer, \
    LoanableSerializer


class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = (IfLibraryAdminThenCRUDElseR, IfLibraryEnabledThenCRUDElseLibraryAdminOnlyCRUD)


class LoanableViewSet(viewsets.ModelViewSet):
    queryset = Loanable.objects.all()
    serializer_class = LoanableSerializer
    permission_classes = (IfLibraryAdminThenCRUDElseR, IfLibraryEnabledThenCRUDElseLibraryAdminOnlyCRUD)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("library__id",)

    def get_queryset(self):
        """The user has access to the loanables coming from every enabled library and to the loanables of every
        library she is a library administrator of."""

        # The library for which the user is library administrator.
        libraries = [role.association.library for role in self.request.user.roles.all() if role.library]

        return Loanable.objects.filter(Q(library__enabled=True) | Q(library__in=libraries))


class LoansViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    permission_classes = (IfLibraryAdminThenCRUDElseCRU, IfLibraryEnabledThenCRUDElseLibraryAdminOnlyCRUD,)

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('status', 'user', 'loan_date', 'loanable__library__id')
    ordering = ('loan_date',)

    @classmethod
    def get_field_from_data_or_instance(cls, field, data, instance, default=None):
        """If the field is in data, return it; otherwise, if the field is in instance, return it; otherwise,
        return None."""
        return data.get(field, getattr(instance, field, default))

    @classmethod
    def check_date_consistency_against_instance(cls, data, instance):
        loan_date = cls.get_field_from_data_or_instance('loan_date', data, instance)
        real_return_date = cls.get_field_from_data_or_instance('real_return_date', data, instance)
        expected_return_date = cls.get_field_from_data_or_instance('expected_return_date', data, instance)

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
            # The user is not a library admin: she is only allowed to change the status of her loan from PENDING
            # to CANCELLED.
            if 'status' in data:
                if instance.status == data['status'] or (
                        instance.status == 'PENDING' and data['status'] == 'CANCELLED'):
                    return True

        return False

    @classmethod
    def check_date_permission_against_instance(cls, data, instance, user):
        """If the user is not a library admin, she is not allowed to changed the dates of the Loan."""

        user_role = user.get_role(instance.loanable.library.association)
        user_is_library_admin = user_role is not None and user_role.library

        if user_is_library_admin:
            return True
        else:
            if 'loan_date' not in data and 'expected_return_date' not in data and 'real_return_date' not in data:
                return True

        return False

    def get_serializer_class(self):
        if self.action in ('create',):
            return CreateLoanSerializer
        elif self.action in ('update', 'partial_update'):
            return UpdateLoanSerializer
        else:
            return LoanSerializer

    def get_queryset(self):
        """The user has access to her loans coming from an enabled library and to the loans of every library she is a
        library administrator of."""

        # The library for which the user is library administrator.
        libraries = [role.association.library for role in self.request.user.roles.all() if role.library]

        q = Loan.objects.filter((Q(user=self.request.user) & Q(loanable__library__enabled=True)) |
                                Q(loanable__library__in=libraries))
        return q

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        loanable = Loanable.objects.get(pk=serializer.validated_data['loanable'].id)

        # Check whether the loanable is already borrowed.
        if loanable.is_borrowed():
            return http.HttpResponseBadRequest('The object is already borrowed.')

        # Check whether the user can create a Loan for another user.
        user_role = request.user.get_role(loanable.library.association)
        user_is_library_admin = user_role is not None and user_role.library

        if not user_is_library_admin:
            if serializer.validated_data['user'].id != request.user.id:
                return http.HttpResponseForbidden('Cannot create a Loan for another user.')

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if not self.check_date_consistency_against_instance(serializer.validated_data, instance):
            return http.HttpResponseBadRequest('The provided dates are inconsistent with the updated Loan.')

        if not self.check_status_consistency_against_instance(serializer.validated_data, instance, request.user):
            return http.HttpResponseForbidden('You are not allowed to change the status of this loan.')

        if not self.check_date_permission_against_instance(serializer.validated_data, instance, request.user):
            return http.HttpResponseForbidden('You are not allowed to change the dates of this loan.')

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
