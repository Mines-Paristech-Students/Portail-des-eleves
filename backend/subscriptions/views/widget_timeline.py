import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Event, Page
from associations.serializers import EventSerializer, PageSerializer


@api_view(["GET"])
def widget_timeline_view(request):
    """
        Display the current and coming events and the five latest news.

        :return: A JSON object with two key, `events` (a list of serialized `Event` objects) and `pages` (a list of
        serialized `Page` objects).
    """

    # The current and coming events.
    events = (
        Event.objects.filter(
            ends_at__gt=datetime.datetime.now(), participants=request.user
        )
        .order_by("-starts_at")
        .all()
    )

    # The latest news.
    offset = request.data.get("offset", 0)
    limit = request.data.get("limit", 10)
    pages = Page.objects.order_by("-last_update_date")[offset : offset + limit].all()

    return Response(
        {
            "events": EventSerializer(many=True).to_representation(events),
            "pages": PageSerializer(many=True).to_representation(pages),
        }
    )
