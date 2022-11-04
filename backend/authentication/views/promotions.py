from rest_framework.decorators import api_view
from rest_framework.response import Response

from authentication.models import User


@api_view(["GET"])
def list_promotions(request):
    # FWIW, `distinct("promotion")` only works on PostgreSQL.
    # See https://docs.djangoproject.com/en/2.2/ref/models/querysets/#distinct.
    return Response(
        {
            "promotions": sorted(
                User.objects.order_by("promotion")
                .distinct("promotion")
                .exclude(promotion__isnull=True)
                .values_list("promotion", flat=True),
                reverse=True,
            )
        }
    )
