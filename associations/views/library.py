from django.db.models import Q

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets

from associations.models import Library, Loan, Loanable
from associations.permissions import CanManageLibrary
from associations.serializers import LibrarySerializer, CreateLoanSerializer, LoanSerializer, UpdateLoanSerializer, \
    LoanableSerializer


class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = (CanManageLibrary,)


class LoansViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    #permission_classes = (CanManageLibrary,)

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('status', 'user', 'loan_date', 'loanable__library__id')
    ordering = ('loan_date',)

    def get_serializer_class(self):
        if self.action in ('create',):
            return CreateLoanSerializer
        elif self.action in ('update', 'partial_update'):
            return UpdateLoanSerializer
        else:
            return LoanSerializer

    def get_queryset(self):
        # The library for which the user is library administrator.
        libraries = [role.association.library for role in self.request.user.roles.all() if role.library]

        return Loan.objects.filter(Q(user=self.request.user) |
                                   Q(loanable__library__in=libraries))


class LoanableViewSet(viewsets.ModelViewSet):
    queryset = Loanable.objects.all()
    serializer_class = LoanableSerializer
    permission_classes = (CanManageLibrary,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("library__id",)
