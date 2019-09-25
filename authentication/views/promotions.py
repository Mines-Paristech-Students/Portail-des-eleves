from rest_framework.decorators import api_view
from rest_framework.response import Response

from authentication.models import User


@api_view(["GET"])
def list_promotions(request):
    # Technically speaking, we are not sure at 100 % to have every promotion.
    # In practice, it will always be OK.

    promotions = [x[0] % 100 for x in User.objects.distinct('year_of_entry').values_list('year_of_entry')]
    return Response({"promotions": sorted(list(promotions), reverse=True)})
