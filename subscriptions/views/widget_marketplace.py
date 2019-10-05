from django.db.models import Q
from django.http import JsonResponse
from rest_framework.decorators import api_view

from associations.models import Marketplace
from associations.views import BalanceView


@api_view(["GET"])
def widget_marketplace_view(request, marketplace_id):
    """Displays the most bought products"""
    marketplace = Marketplace.objects.get(pk=marketplace_id)

    response = {}
    response["balance"] = BalanceView.get_balance_in_json(marketplace, request.user)

    suggested_products = marketplace.products.filter(~Q(number_left=0)).all()
    suggested_products = sorted(
        suggested_products,
        key=lambda product: product.transactions.filter(buyer=request.user).count(),
        reverse=True,
    )
    response["suggested_products"] = suggested_products[:5]

    return JsonResponse(response)
