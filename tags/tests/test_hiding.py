import datetime

from associations.models import Event
from authentication.models import User
from tags.models import Tag
from tags.tests.base_test import BaseTestCase


class HidingTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_association.yaml", "test_hiding.yaml"]
    maxDiff = None

    def setUp(self):
        event = Event.objects.get(pk=2)
        tag = Tag.objects.get(pk=1)
        event.tags.add(tag)
        event.save()

    def test_events_are_hidden(self):
        self.login("17simple")

        #########################################
        # Get all events

        response = self.get("/associations/events/")
        self.assertEqual(len(response.data), 2)

        ##########################################
        # 17 simple turns into a 1A
        simple17 = User.objects.get(pk="17simple")
        now = datetime.datetime.now()
        simple17.year_of_entry = now.year
        simple17.save()
        self.assertTrue(simple17.is_in_first_year)

        ###########################################
        # Get all events, but one should be missing

        response = self.get("/associations/events/")
        self.assertEqual(len(response.data), 1)
