from datetime import timedelta
from django.utils import timezone

from associations.models import Event, Association
from associations.tests.event.base_test_event import *
from subscriptions.views import widget_calendar

turn_little = widget_calendar.turn_little


class CalendarTestCase(BaseEventsTestCase):
    events_displayed = []

    # Association for the events test #
    association = Association.objects.get(id="biero")

    # Test events #

    # Don't display the events which start two weeks after now ?
    #
    # event_starts_two_weeks_after = {
    #     "association": association,
    #     "name": "Grosse biéro dans 2 semaines",
    #     "description": "On y croit",
    #     "starts_at": timezone.now() + timedelta(weeks=2),
    #     "ends_at": timezone.now() + timedelta(days=15),
    #     "place": "Octo",
    # }
    #
    # event_starts_two_weeks_after_little = turn_little(event_starts_two_weeks_after)

    event_starts_one_week_after = {
        "association": association,
        "name": "Grosse biéro dans 1 semaine",
        "description": "On y croit (pas)",
        "starts_at": timezone.now() + timedelta(weeks=1),
        "ends_at": timezone.now() + timedelta(days=8),
        "place": "Octo",
    }

    event_starts_one_week_after_little = turn_little(event_starts_one_week_after)

    event_ends_one_week_before = {
        "association": association,
        "name": "Grosse biéro...",
        "description": "On y croit (plus)",
        "starts_at": timezone.now() - timedelta(days=8),
        "ends_at": timezone.now() - timedelta(weeks=1),
        "place": "Octo",
    }

    event_ends_one_week_before_little = turn_little(event_ends_one_week_before)

    def setUp(self):
        # Event.objects.create(**self.event_starts_two_weeks_after)
        Event.objects.create(**self.event_starts_one_week_after)
        Event.objects.create(**self.event_ends_one_week_before)

        # Get events displayed on the calendar #
        self.events_displayed = widget_calendar.events_in_calendar()

    def check_if_event_displayed(self, event):
        res = False

        for value in self.events_displayed.values():
            for event_displayed in value:
                res = event == event_displayed

        return res

    # def test_if_starts_two_weeks_after_not_displayed(self):
    #     self.assertFalse(self.check_if_event_displayed(self.event_starts_two_weeks_after_little))

    def test_if_starts_one_week_after_is_displayed(self):
        self.assertTrue(
            self.check_if_event_displayed(self.event_starts_one_week_after_little)
        )

    def test_if_ends_one_week_before_not_displayed(self):
        self.assertFalse(
            self.check_if_event_displayed(self.event_ends_one_week_before_little)
        )
