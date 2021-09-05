from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import date

from associations.models import Event, Association
from associations.views import EventFilter


def turn_little(event):
    """
    :return: The little version of an event, used in the calendar
    """
    if type(event.association) is Association:
        association = {
            "id": event.association.id,
            "name": event.association.name,
            "logo": "",
        }

        if event.association.logo is None:
            association["logo"] = ""
        else:
            association["logo"] = event.association.logo.preview_url
    else:
        association = {
            "id": event.association,
            "name": event.association,
            "logo": "",
        }

    event_little = {
        "id": event.id,
        "association": association,
        "name": event.name,
        "starts_at": event.starts_at,
        "ends_at": event.ends_at
    }

    return event_little


def events_in_calendar():
    """
        :return: A JSON object with one key, `events`, which is a list of objects `{}`.
        """
    queryset_events = Event.objects.all()
    queryset_events_to_come = EventFilter.filter_time(queryset=queryset_events, _="_", times=["NOW", "AFTER"])

    events_to_come = [
        turn_little(event)
        for event in queryset_events_to_come
    ]

    events_to_come_ordered = {}
    for event in events_to_come:
        event_date = event["starts_at"].date().__str__()

        if event_date not in events_to_come_ordered:
            events_to_come_ordered[event_date] = []

        events_to_come_ordered[event_date].append(event)

    return Response(
        {
            "events": events_to_come_ordered
        }
    )


@api_view(["GET"])
def widget_calendar_view(request):
    return events_in_calendar()
