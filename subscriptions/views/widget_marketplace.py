from django.db.models import Q, Count
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

    suggested_products = (
        marketplace.products.annotate(
            number_of_purchases=Count(
                "transaction", filter=Q(buyer=request.user)
            )
        )
        .order_by("-number_of_purchases")
        .exclude(number_left=0)[0:5]
        .all()
    )

    response["suggested_products"] = suggested_products

    return JsonResponse(response)
