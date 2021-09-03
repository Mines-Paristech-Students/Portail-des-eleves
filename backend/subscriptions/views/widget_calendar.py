from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Event
from associations.views import EventFilter


@api_view(["GET"])
def widget_calendar_view(request):
    """
    :return: A JSON object with one key, `events`, which is a list of objects `{}`.
    """
    queryset_events = Event.objects.all()
    queryset_events_to_come = EventFilter.filter_time(queryset=queryset_events, _="_", times=["NOW", "AFTER"])

    events_to_come = [
        {
            "association": {
                "name": event.association.name
            },
            "name": event.name
        }
        for event in queryset_events_to_come
    ]

    return Response(
        {
            "events": events_to_come
        }
    )
