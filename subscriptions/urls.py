from django.urls import path

from subscriptions.views import get_widgets, get_associations, set_subscriptions

urlpatterns = [
    path("get_widgets/", get_widgets),
    path("get_associations/", get_associations),
    path("", set_subscriptions),
]
