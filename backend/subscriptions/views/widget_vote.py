import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Election


@api_view(["GET"])
def widget_vote_view(request):
    """
        Display the current elections.

        :return: A JSON object with one key, `elections`, which is a list of objects `{"id", "has_voted", "ends_at"}`.
    """

    return Response(
        {
            "elections": [
                {
                    "id": election.id,
                    "has_voted": request.user in election.voters.all(),
                    "ends_at": election.ends_at,
                }
                for election in Election.objects.filter(
                    registered_voters=request.user, ends_at__gte=datetime.datetime.now()
                )
                .order_by("-ends_at")
                .all()
            ]
        }
    )
