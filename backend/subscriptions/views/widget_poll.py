from rest_framework.decorators import api_view
from rest_framework.response import Response

from polls.models import Poll, Vote
from polls.views import PollViewSet


@api_view(["GET"])
def widget_poll_view(request):
    """
        Display the active polls.

        :return: A JSON object with one key, `active_polls`, containing a list of serialized `Poll` objects.
    """

    return Response(
        {
            "active_polls": [
                PollViewSet.as_view({"get": "results"})(request).content
                if Vote.objects.filter(poll=poll, user=request.user).exists()
                else PollViewSet.as_view({"get": "retrieve"})(request).content
            ]
            for poll in Poll.objects.all()
            if poll.is_active
        }
    )
