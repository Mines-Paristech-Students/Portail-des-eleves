from django.db.models import Q, Count
from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Marketplace
from associations.views import BalanceView
from associations.serializers.marketplace import ProductShortSerializer


@api_view(["GET"])
def widget_marketplace_view(request, marketplace_id):
    """
        Display the five most purchased products of the marketplace if they are available.

        :return: A JSON object with two keys, `balance` (the balance of the marketplace) and `suggested_products`,
        a list of serialized `Product` objects.
    """

    marketplace = Marketplace.objects.get(pk=marketplace_id)

    suggested_products = (
        marketplace.products.annotate(
            number_of_purchases=Count(
                "transactions", filter=Q(transactions__buyer=request.user)
            )
        )
        .order_by("-number_of_purchases")
        .exclude(number_left=0)[0:5]
        .all()
    )

    return Response(
        {
            "balance": BalanceView.get_balance_in_json(request.user, marketplace),
            "suggested_products": [
                ProductShortSerializer().to_representation(product)
                for product in suggested_products
            ],
        }
    )
