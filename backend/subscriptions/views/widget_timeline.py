import datetime

import pytz
from django.db.models import Count, Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Page, Media
from django.db import connection

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

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT COUNT(*), association_id, DATE(uploaded_on) AS upload_date "
            "FROM associations_media "
            "WHERE uploaded_on >= %s"
            "GROUP BY association_id, DATE(uploaded_on) "
            "ORDER BY DATE(uploaded_on) DESC "
            "LIMIT 100;",
            [limit_date.isoformat()],
        )
        result = cursor.fetchall()

    for row in result:
        count, association_id, date = row
        media_serializer = MediaSerializer(many=True)
        media_serializer.context["request"] = request  # useful for url generation

        event = {
            "date": datetime.datetime(
                year=date.year,
                month=date.month,
                day=date.day,
                tzinfo=pytz.timezone("Europe/Paris"),
            ),
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
