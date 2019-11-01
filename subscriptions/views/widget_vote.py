from django.http import JsonResponse
from rest_framework.decorators import api_view

from associations.models import Election


@api_view(["GET"])
def widget_vote_view(request):
    current_elections = Election.objects.filter(registered_voters__id=request.user.id)
    response = []
    for election in current_elections:
        response.append(
            {
                "id": election.id,
                "has_voted": request.user in election.voters,
                "ends_on": election.ends_at,
            }
        )

    return JsonResponse(response)
