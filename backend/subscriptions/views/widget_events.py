from datetime import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Event
from associations.serializers.media import urlize
from authentication.serializers.user_short import UserShortSerializer


@api_view(["GET"])
def widget_event_view(request):
    """
    :return: A JSON object with one key, `balances`, which is a list of objects `{"balance", "marketplace", "user"}`.
    """

    return Response(
        {
            "events": list(
                map(
                    lambda event: {
                        "id": event.id,
                        "name": event.name,
                        "description": event.description,
                        "association": {
                            "id": event.association.id,
                            "name": event.association.name,
                            "logo": urlize(request, event.association.logo.preview_url),
                        },
                        "participants": UserShortSerializer(
                            many=True
                        ).to_representation(event.participants),
                        "starts_at": event.starts_at,
                        "ends_at": event.ends_at,
                        "place": event.place,
                    },
                    Event.objects.filter(ends_at__gt=datetime.now())
                    .order_by("starts_at")[:5]
                    .all(),
                )
            )
        }
    )
