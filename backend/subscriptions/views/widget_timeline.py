import datetime

from django.db.models import Count
from django.db.models.functions import Trunc
from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Page, Media

from associations.serializers import PageSerializer
from associations.serializers.media import MediaSerializer


@api_view(["GET"])
def widget_timeline_view(request):
    """
        Display the current and coming events and the five latest news.

        :return: A JSON object with two key, `events` (a list of serialized `Event` objects) and `pages` (a list of
        serialized `Page` objects).
    """

    timeline = []

    # The latest news.
    pages = (
        Page.objects.filter(page_type=Page.NEWS)
        .order_by("-last_update_date")[:10]
        .all()
    )

    pages = list(
        map(
            lambda page: {
                "date": page.last_update_date,
                "type": "NEWS",
                "payload": PageSerializer().to_representation(page),
            },
            pages,
        )
    )
    timeline.extend(pages)

    # Latest uploaded medias
    if len(pages) > 0:
        limit_date = pages[-1]["date"]
    else:
        limit_date = datetime.datetime.now() - datetime.timedelta(days=15)

    result = (
        Media.objects.annotate(day=Trunc("uploaded_on", "day"))
        .values("association", "day")
        .annotate(c=Count("association"))
        .filter(uploaded_on__gt=limit_date)
        .order_by("-uploaded_on__date")[:100]
    )

    for row in result:
        count, association_id, date = row["c"], row["association"], row["day"]
        media_serializer = MediaSerializer(many=True)
        media_serializer.context["request"] = request  # useful for url generation

        event = {
            "date": date,
            "type": "FILE_UPLOAD",
            "payload": {
                "count": count,
                "association_id": association_id,
                "medias": media_serializer.to_representation(
                    Media.objects.filter(
                        association_id=association_id, uploaded_on__date=date
                    )
                    .exclude(preview="")[:15]
                    .all()
                ),
            },
        }
        timeline.append(event)

    timeline.sort(key=lambda x: x["date"], reverse=True)

    return Response({"timeline": timeline})
