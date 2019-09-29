from django.urls import reverse
from rest_framework.decorators import api_view


@api_view(["GET"])
def get_widgets():

    return {
        "main": reverse("widget_timeline"),
        "mandatory": [
            reverse("widget_" + name)
            for name in ["birthday", "poll", "vote", "repartition", "balance"]
        ],
        "optional": [reverse("widget_" + name) for name in ["marketplace", "library"]],
    }
