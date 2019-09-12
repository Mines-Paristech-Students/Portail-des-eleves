from django.db.models import Q

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets

from associations.models import Library, Loan, Loanable
from associations.permissions import IsLibraryAdminOrReadOnly, IsLibraryAdminOrReadPostPatchOnly, \
    IsLibraryEnabledOrLibraryAdminOnly
from associations.serializers import LibrarySerializer, get_create_loan_serializer_class, LoanSerializer,\
    get_update_loan_serializer_class, LoanableSerializer


class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = (IsLibraryAdminOrReadOnly, IsLibraryEnabledOrLibraryAdminOnly)


class LoansViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    permission_classes = (IsLibraryAdminOrReadPostPatchOnly, IsLibraryEnabledOrLibraryAdminOnly,)

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('status', 'user', 'loan_date', 'loanable__library__id')
    ordering = ('loan_date',)

    def get_serializer_class(self):
        if self.action in ('create',):
            return get_create_loan_serializer_class(self.request.user)
        elif self.action in ('update', 'partial_update'):
            return get_update_loan_serializer_class(self.request.user)
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


class LoanableViewSet(viewsets.ModelViewSet):
    queryset = Loanable.objects.all()
    serializer_class = LoanableSerializer
    permission_classes = (IsLibraryAdminOrReadOnly, IsLibraryEnabledOrLibraryAdminOnly)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("library__id",)

    def get_queryset(self):
        """The user has access to the loanables coming from every enabled library and to the loanables of every
        library she is a library administrator of."""

        # The library for which the user is library administrator.
        libraries = [role.association.library for role in self.request.user.roles.all() if role.library]

        return Loanable.objects.filter(Q(library__enabled=True) | Q(library__in=libraries))
