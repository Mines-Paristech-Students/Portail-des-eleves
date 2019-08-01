from django.http import JsonResponse
from rest_framework.decorators import api_view

from authentication.models import User


@api_view(["GET"])
def get_promotions(request):
    query = list(User.objects.order_by().values("promo").distinct())
    res = [e["promo"] for e in query]
    res.sort(reverse=True)
    return JsonResponse({"promotions": res})
