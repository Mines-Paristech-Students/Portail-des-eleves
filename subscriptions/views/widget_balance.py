from django.http import JsonResponse
from rest_framework.decorators import api_view

from associations.models import Marketplace
from associations.views import BalanceView


@api_view(["GET"])
def widget_balance_view(request):
    marketplaces = Marketplace.objects.all()
    balances = []

    for marketplace in marketplaces:
        balances.append(BalanceView.get_balance_in_json(marketplace, request.user))

    return JsonResponse(balances)
