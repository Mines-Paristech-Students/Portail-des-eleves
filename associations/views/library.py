from rest_framework import viewsets

from associations.models import Library, Loan, Loanable
from associations.serializers import LibrarySerializer, LoanSerializer, LoanableSerializer


class LibraryViewSet(viewsets.ModelViewSet):
    queryset = Library.objects.all()
    serializer_class = LibrarySerializer


class LoansViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

class LoanableViewSet(viewsets.ModelViewSet):
    queryset = Loanable.objects.all()
    serializer_class = LoanableSerializer
