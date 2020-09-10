from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Marketplace
from associations.views import BalanceView


@api_view(["GET"])
def widget_balance_view(request):
    """
    :return: A JSON object with one key, `balances`, which is a list of objects `{"balance", "marketplace", "user"}`.
    """

    return Response(
        {
            "balances": [
                BalanceView.get_balance_in_json(request.user, marketplace)
                for marketplace in Marketplace.objects.filter(enabled=True).all()
            ]
        }
    )
