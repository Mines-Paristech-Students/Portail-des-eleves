from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import date

from associations.models import Event, Association
from associations.views import EventFilter


def turn_little(event):
    """
    :return: The little version of an event, used in the calendar
    """
    if type(event) is Event:
        event_association = event.association
        event_name = event.name
        event_starts_at = event.starts_at
        event_ends_at = event.ends_at
    else:
        event_association = event["association"]
        event_name = event["name"]
        event_starts_at = event["starts_at"]
        event_ends_at = event["ends_at"]

    if type(event_association) is Association:
        association = {
            "id": event_association.id,
            "name": event_association.name,
            "logo": "",
        }

        if event_association.logo is None:
            association["logo"] = ""
        else:
            association["logo"] = event_association.logo.preview_url
    else:
        association = {
            "id": event_association,
            "name": event_association,
            "logo": "",
        }

    event_little = {
        "association": association,
        "name": event_name,
        "starts_at": event_starts_at,
        "ends_at": event_ends_at,
    }

    return event_little


def events_in_calendar():
    """
    :return: A JSON object with one key, `events`, which is a
    list of objects described in the "turn_little" function.
    """
    queryset_events = Event.objects.all()
    queryset_events_to_come = EventFilter.filter_time(
        queryset=queryset_events, _="_", times=["NOW", "AFTER"]
    )

    events_to_come = [turn_little(event) for event in queryset_events_to_come]

    events_to_come_ordered = {}
    for event in events_to_come:
        event_date = event["starts_at"].date().__str__()

        if event_date not in events_to_come_ordered:
            events_to_come_ordered[event_date] = []

        events_to_come_ordered[event_date].append(event)

    return events_to_come_ordered


@api_view(["GET"])
def widget_calendar_view(request):
    return Response({"events": events_in_calendar()})
