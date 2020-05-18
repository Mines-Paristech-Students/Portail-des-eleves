from rest_framework.decorators import api_view
from rest_framework.response import Response

from authentication.models import User


@api_view(["GET"])
def list_promotions(request):
    return Response(
        {
            "promotions": sorted(
                set(User.objects.values_list("promotion", flat=True)), reverse=True
            )
        }
    )
