from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from subscriptions.views.subscription_viewset import WidgetSubscriptionViewSet
from subscriptions.views.widget_balance import widget_balance_view
from subscriptions.views.widget_birthday import widget_birthday_view
from subscriptions.views.widget_calendar import widget_calendar_view
from subscriptions.views.widget_library import widget_library_view
from subscriptions.views.widget_marketplace import widget_marketplace_view
from subscriptions.views.widget_poll import widget_poll_view
from subscriptions.views.widget_repartition import widget_repartition_view
from subscriptions.views.widget_timeline import widget_timeline_view
from subscriptions.views.widget_vote import widget_vote_view
from subscriptions.views.widgets_list import get_widgets

"""
Mandatory widgets :
- Timeline
- Birthday
- Poll
- Votes (if not voted before)
- Repartition (if not made wishes before)
- Balance

Optional widgets : 
- Marketplace -> most bought by the user
- Library -> most borrowed by the user

The subscription configuration is saved in a simple JSON that the frontend will use
"""

router = BulkRouter()

router.register(r"subscriptions", WidgetSubscriptionViewSet)

urlpatterns = [
    path("", get_widgets),
    path("timeline/", widget_timeline_view, name="widget_timeline"),
    path("birthday/", widget_birthday_view, name="widget_birthday"),
    path("poll/", widget_poll_view, name="widget_poll"),
    path("vote/", widget_vote_view, name="widget_vote"),
    path("repartition/", widget_repartition_view, name="widget_repartition"),
    path("balance/", widget_balance_view, name="widget_balance"),
    path(
        "marketplace/<marketplace_id>/",
        widget_marketplace_view,
        name="widget_marketplace",
    ),
    path("library/<library_id>/", widget_library_view, name="widget_library"),
    path("calendar/", widget_calendar_view, name="widget_calendar"),
] + router.urls
