from rest_framework import viewsets

from associations.models import Library, Loan
from associations.serializers import LibrarySerializer, LoanSerializer


class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer


class LoansViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
