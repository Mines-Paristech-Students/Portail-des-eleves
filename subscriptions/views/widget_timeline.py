import datetime

from django.http import JsonResponse
from rest_framework.decorators import api_view

from associations.models import Event, Page
from associations.serializers import EventSerializer, PageSerializer


@api_view(["GET"])
def widget_timeline_view(request):
    # show the next events
    events = (
        Event.objects.filter(
            ends_at__gt=datetime.datetime.now(),
            starts_at=datetime.datetime.now() + datetime.timedelta(hours=6),
            participants__in=request.user.id,
        )
        .order_by("-starts_at")
        .all()
    )

    response = [
        {"type": "event", "payload": event}
        for event in EventSerializer(many=True).to_representation(events)
    ]

    # the the lastest news
    offset = request.data.get("offset", 0)
    limit = request.data.get("limit", 10)

    pages = Page.objects.order_by("-last_update_date")[offset : offset + limit].all()
    response += [
        {"type": "page", "payload": page}
        for page in PageSerializer(many=True).to_representation(pages)
    ]

    return JsonResponse(response)
