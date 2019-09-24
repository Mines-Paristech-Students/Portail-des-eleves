from rest_framework.decorators import api_view
from rest_framework.response import Response

from authentication.models import User


@api_view(["GET"])
def list_promotions(request):
    promotions = set(user.promotion for user in User.objects.all())
    return Response({"promotions": sorted(list(promotions), reverse=True)})
