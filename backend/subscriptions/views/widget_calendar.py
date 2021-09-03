from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Event
from associations.views import EventFilter


def turn_little(event):
    """
    :return: The little version of an event, used in the calendar
    """
    event_little = {
        "association": {
            "name": event.association
        },
        "name": event.name
    }

    return event_little

@api_view(["GET"])
def widget_calendar_view(request):
    """
    :return: A JSON object with one key, `events`, which is a list of objects `{}`.
    """
    queryset_events = Event.objects.all()
    queryset_events_to_come = EventFilter.filter_time(queryset=queryset_events, _="_", times=["NOW", "AFTER"])

    events_to_come = [
        turn_little(event)
        for event in queryset_events_to_come
    ]

    return Response(
        {
            "events": events_to_come
        }
    )
