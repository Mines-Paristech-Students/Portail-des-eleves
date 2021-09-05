from datetime import datetime, timezone, timedelta

from associations.models import Event
from associations.tests.event.base_test_event import *
from subscriptions.views import widget_calendar

turn_little = widget_calendar.turn_little


class CalendarTestCase(BaseEventsTestCase):
    events_displayed = []

    # Test events #
    event_starts_two_weeks_after = {
        "association": "biero",
        "name": "Grosse biéro dans 2 semaines",
        "description": "On y croit",
        "participants": [],
        "starts_at": timezone.now() + timedelta(weeks=2),
        "ends_at": timezone.now() + timedelta(days=15),
        "place": "Octo",
    }

    event_starts_two_weeks_after_little = turn_little(event_starts_two_weeks_after)

    event_starts_one_week_after = {
        "association": "biero",
        "name": "Grosse biéro dans 1 semaine",
        "description": "On y croit (pas)",
        "participants": [],
        "starts_at": timezone.now() + timedelta(weeks=1),
        "ends_at": timezone.now() + timedelta(days=8),
        "place": "Octo",
    }

    event_starts_one_week_after_little = turn_little(event_starts_two_weeks_after)

    event_ends_one_week_before = {
        "association": "biero",
        "name": "Grosse biéro...",
        "description": "On y croit (plus)",
        "participants": [],
        "starts_at": timezone.now() - timedelta(days=8),
        "ends_at": timezone.now() - timedelta(weeks=1),
        "place": "Octo",
    }

    event_ends_one_week_before_little = turn_little(event_ends_one_week_before)

    def setUp(self):
        Event.objects.create(*self.event_starts_two_weeks_after)
        Event.objects.create(*self.event_starts_one_week_after)
        Event.objects.create(*self.event_ends_one_week_before)

        self.events_displayed = widget_calendar.events_in_calendar()

    def test_if_starts_two_weeks_after_not_displayed(self):
        self.assertFalse(self.event_starts_two_weeks_after_little in self.events_displayed)

    def test_if_starts_one_week_after_is_displayed(self):
        self.assertTrue(self.event_starts_one_week_after_little in self.events_displayed)

    def test_if_ends_one_week_before_not_displayed(self):
        self.assertFalse(self.event_ends_one_week_before_little in self.events_displayed)

