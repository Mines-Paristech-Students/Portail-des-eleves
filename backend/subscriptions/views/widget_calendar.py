from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Event
from associations.views import EventFilter


@api_view(["GET"])
def widget_calendar_view(request):
    """
    :return: A JSON object with one key, `events`, which is a list of objects `{}`.
    """
    events = Event.objects.all()

    return Response(
        {
            "events": [
                EventFilter.filter_time(queryset=events, _="_", times=["NOW", "AFTER"])
            ]
        }
    )
