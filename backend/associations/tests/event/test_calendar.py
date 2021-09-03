from datetime import datetime, timezone, timedelta

from django.core.exceptions import ObjectDoesNotExist

from associations.models import Event
from associations.tests.event.base_test_event import *


class EventsTestCase(BaseEventsTestCase):
    def test_if_not_logged_in_then_no_access_to_events(self):
        res = self.list(association_id="biero")
        self.assertStatusCode(res, 401)