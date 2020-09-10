from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models.library import Library
from associations.models.marketplace import Marketplace


@api_view(["GET"])
def get_widgets(*args, **kwargs):
    """
    Display the list of the available widgets.

    :return: A JSON object with one key, `widgets`. This key holds a list of objects `{"type", "mandatory", "url"}`.
    """

    mandatory_widgets = [
        {
            "type": widget_type,
            "mandatory": True,
            "url": reverse(f"widget_{widget_type}"),
        }
        for widget_type in [
            "timeline",
            "birthday",
            "poll",
            "vote",
            "repartition",
            "balance",
            "event",
        ]
    ]

    marketplace_widgets = [
        {
            "type": "marketplace",
            "mandatory": False,
            "url": reverse("widget_marketplace", args=[marketplace_id]),
        }
        for marketplace_id in Marketplace.objects.values_list("id", flat=True)
    ]

    library_widgets = [
        {
            "type": "library",
            "mandatory": False,
            "url": reverse("widget_library", args=[library_id]),
        }
        for library_id in Library.objects.values_list("id", flat=True)
    ]

    return Response(
        {"widgets": mandatory_widgets + marketplace_widgets + library_widgets}
    )
