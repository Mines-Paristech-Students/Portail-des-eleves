from datetime import datetime, timezone, timedelta

from django.core.exceptions import ObjectDoesNotExist

from associations.models import User, Event
from associations.tests.events.base_test_events import *


class EventsTestCase(BaseEventsTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_events(self):
        res = self.list(association_id='biero')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_events(self):
        self.login('17simple')
        res = self.list(association_id='biero')
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_event(self):
        res = self.retrieve(association_id='biero', pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_event(self):
        self.login('17simple')
        res = self.retrieve(association_id='biero', pk=1)
        self.assertStatusCode(res, 200)

    def test_if_event_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.retrieve(association_id='biero', pk=42)
        self.assertFalse(Event.objects.filter(pk='42').exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    event = {
        'association': 'biero',
        'name': 'Biéro pas loose',
        'description': 'On y croit',
        'participants': ['17events_biero', '17admin_pdm'],
        'starts_at': datetime(2019, 3, 1, 22, 00, 00, tzinfo=timezone.utc),
        'ends_at': datetime(2019, 3, 2, 2, 00, 00, tzinfo=timezone.utc),
        'place': 'Octo',
    }

    inconsistent_event = {
        'association': 'biero',
        'name': 'Biéro pas loose',
        'description': 'On y croit',
        'participants': ['17events_biero', '17admin_pdm'],
        'starts_at': datetime(2019, 5, 1, 22, 00, 00, tzinfo=timezone.utc),
        'ends_at': datetime(2019, 3, 2, 2, 00, 00, tzinfo=timezone.utc),
        'place': 'Octo',
    }

    def test_if_not_event_admin_then_cannot_create_event(self):
        for user in ALL_USERS_EXCEPT_EVENTS_BIERO:
            self.login(user)
            res = self.create(association_id='biero', data=self.event)
            self.assertStatusCode(res, 403, user_msg=user)
            self.assertRaises(ObjectDoesNotExist, Event.objects.get, name=self.event['name'])

    def test_if_event_admin_then_can_create_event(self):
        self.login('17events_biero')  # Event administrator.
        res = self.create(association_id='biero', data=self.event)
        self.assertStatusCode(res, 201)

        self.assertTrue(Event.objects.filter(name=self.event['name']).exists())
        event = Event.objects.get(name=self.event['name'])
        self.assertEqual(event.description, self.event['description'])
        self.assertEqual(event.place, self.event['place'])
        self.assertEqual(event.starts_at, self.event['starts_at'])
        self.assertEqual(event.ends_at, self.event['ends_at'])

    def test_cannot_create_event_with_inconsistent_dates(self):
        self.login('17events_biero')
        res = self.create(association_id='biero', data=self.inconsistent_event)
        self.assertStatusCode(res, 400)

    ##########
    # UPDATE #
    ##########

    def test_if_not_event_admin_then_cannot_update_event(self):
        for user in ALL_USERS_EXCEPT_EVENTS_BIERO:
            self.login(user)
            data = {'pk': 1, 'name': 'Biéroloose', 'description': 'Personne'}
            res = self.update(data['pk'], data=data, association_id='biero')
            self.assertStatusCode(res, 403)
            self.assertEqual(Event.objects.get(pk=data['pk']).name, 'Biéro')

    def test_if_event_admin_then_can_update_event_with_allowed_data(self):
        self.login('17events_biero')
        data = {'pk': 1, 'name': 'Biéroloose', 'description': 'Personne'}
        res = self.update(data['pk'], data=data, association_id='biero')
        self.assertStatusCode(res, 200)

        event = Event.objects.get(pk=data['pk'])
        self.assertEqual(event.name, data['name'])
        self.assertEqual(event.description, data['description'])

    def test_if_event_admin_then_cannot_update_event_with_inconsistent_dates(self):
        self.login('17events_biero')
        event_before = Event.objects.get(pk=0)
        data = {'pk': 0,
                'starts_at': event_before.ends_at + timedelta(1),
                'name': 'Changement de date'}

        res = self.update(data['pk'], data=data, association_id='biero')
        self.assertStatusCode(res, 400)
        event_after = Event.objects.get(pk=0)
        self.assertEqual(event_before, event_after)

    def test_if_event_admin_then_can_update_participants(self):
        self.login('17events_biero')
        data = {'pk': 0,
                'participants': ['17events_biero', '17member_biero']}
        res = self.update(data['pk'], 'biero', data=data)
        self.assertStatusCode(res, 200)
        self.assertSetEqual(set([x['participants'] for x in Event.objects.filter(pk=0).values('participants')]),
                            set(data['participants']))

    ###########
    # DESTROY #
    ###########

    def test_if_not_event_admin_then_cannot_destroy_event(self):
        for user in ALL_USERS_EXCEPT_EVENTS_BIERO:
            self.login(user)
            res = self.destroy(1, association_id='biero')
            self.assertStatusCode(res, 403)
            self.assertTrue(Event.objects.filter(pk=1).exists())

    def test_if_event_admin_then_can_destroy_event(self):
        self.login('17events_biero')  # Event administrator.
        res = self.destroy(1, 'biero')
        self.assertStatusCode(res, 204)
        self.assertFalse(Event.objects.filter(pk=1).exists())

    ################
    # JOIN / LEAVE #
    ################

    def test_can_join_and_leave_event(self):
        for user in ALL_USERS:
            self.login(user)

            res = self.join(association_id='biero', pk=1)
            self.assertStatusCode(res, 200)
            self.assertTrue(User.objects.get(pk=user) in Event.objects.get(pk=1).participants.all(),
                            msg=f'User {user} did not join.')

            res = self.leave(association_id='biero', pk=1)
            self.assertStatusCode(res, 200)
            self.assertFalse(User.objects.get(pk=user) in Event.objects.get(pk=1).participants.all(),
                             msg=f'User {user} did not leave.')
