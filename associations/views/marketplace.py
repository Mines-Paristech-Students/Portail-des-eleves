from rest_framework import viewsets

from associations.models import Marketplace
from associations.serializers import MarketplaceSerializer


class MarketplaceViewSet(viewsets.ModelViewSet):
    queryset = Marketplace.objects.all()
    serializer_class = MarketplaceSerializer
