from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets

from associations.models import Library, Loan, Loanable
from associations.permissions import CanManageLibrary
from associations.serializers import LibrarySerializer, LoanSerializer, LoanableSerializer


class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer
    permission_classes = (CanManageLibrary,)


class LoansViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = (CanManageLibrary,)

    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    filter_fields = ('status', 'user', "loan_date", "loanable__library__id")
    ordering = ('loan_date',)


class LoanableViewSet(viewsets.ModelViewSet):
    queryset = Loanable.objects.all()
    serializer_class = LoanableSerializer
    permission_classes = (CanManageLibrary,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("library__id",)
