from datetime import date, datetime, timedelta, timezone

from rest_framework import status
from rest_framework.exceptions import NotAuthenticated

from backend.tests_utils import BaseTestCase
from authentication.models import User
from polls.models import Poll, Choice


class PollTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_polls.yaml']

    ALL_USERS = ['17admin', '17simple']
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return '/polls/'

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f'/polls/{pk}/'

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return '/polls/'

    def create(self, data=None, format='json', content_type='application/json'):
        return self.post(self.endpoint_create(), data, format, content_type)

    def endpoint_update(self, pk):
        return f'/polls/{pk}/'

    def update(self, pk, data=None, format='json', content_type='application/json'):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_destroy(self, pk):
        return f'/polls/{pk}/'

    def destroy(self, pk, data='', format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)

    def endpoint_vote(self, pk):
        return f'/polls/{pk}/vote/'

    def vote(self, pk, data=None, format='json', content_type='application/json'):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_results(self, pk):
        return f'/polls/{pk}/results/'

    def results(self, pk, data='', format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def test_if_not_admin_then_can_list_published_polls_and_own_polls(self):
        self.login('17simple')
        res = self.list()
        self.assertStatusCode(res, 200)
        ...

    def test_if_admin_then_can_list_every_poll(self):
        self.login('17admin')
        res = self.list()
        ...

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve(self):
        res = self.retrieve(1)
        self.assertStatusCode(res, 401)

    def test_if_poll_does_not_exist_then_404(self):
        for user in self.ALL_USERS:
            res = self.retrieve(42)
            self.assertStatusCode(res, 404)

    def test_if_logged_in_then_can_retrieve_own_poll(self):
        for user in self.ALL_USERS:
            poll_id = Poll.objects.filter(user=user)[0].id
            res = self.retrieve(poll_id)
            self.assertStatusCode(res, 200)
            ...

    def test_if_logged_in_then_can_retrieve_published_poll(self):
        for user in self.ALL_USERS:
            for poll in Poll.objects.filter(status='ACCEPTED', publication_date__lte=date.today()):
                res = self.retrieve(poll.id)
                self.assertStatusCode(res, 200)
                ...

    def test_if_admin_then_can_retrieve_any_poll(self):
        self.login('17admin')

        for poll in Poll.objects.all():
            res = self.retrieve(poll.id)
            self.assertStatusCode(res, 200)
            ...

    def test_if_not_admin_then_cannot_retrieve_forbidden_polls(self):
        self.login('17user')
        poll_id = Poll.objects.filter(user='17admin')[0]
        res = self.retrieve(poll_id)
        self.assertStatusCodeIn(res, [403, 404])
        ...

    def test_if_admin_then_can_retrieve_all_fields(self):
        self.login('17admin')

        for poll in Poll.objects.all():
            res = self.retrieve(poll.id)
            self.assertStatusCode(res, 200)
            self.assertSetEqual(
                set(res.data.keys()),
                ...
            )

    def test_if_author_then_can_retrieve_all_fields(self):
        self.login('17simple')

        for poll in Poll.objects.filter(user='17simple'):
            res = self.retrieve(poll.id)
            self.assertStatusCode(res, 200)
            self.assertSetEqual(
                set(res.data.keys()),
                ...
            )

    def test_if_not_author_then_can_retrieve_limited_fields(self):
        self.login('17simple')

        polls = Poll.objects.filter(status='ACCEPTED', publication_date__lte=date.today()).exclude(user='17simple')

        self.assertGreater(polls.count(), 0)

        for poll in polls:
            res = self.retrieve(poll.id)
            self.assertStatusCode(res, 200)
            ...

    ##########
    # CREATE #
    ##########

    create_data = {
        'question': 'La nouvelle devise des Mines ?',
        'choices': [
            {'text': 'Fake it until you make it.'},
            {'text': 'Too much is not enough.'}
        ]
    }

    create_data_with_extra_fields = create_data.update({
        'user': '17bocquet',
        'state': 'ACCEPTED',
        'publication_date': date(2019, 1, 1),
        'admin_comment': 'Very good.'
    })

    def check_last_poll(self, user, data):
        poll = Poll.objects.last()
        now = datetime.now(tz=timezone.utc)
        self.assertEqual(poll.question, data['question'])
        self.assertEqual(poll.user, user)
        self.assertTupleEqual(
            (poll.creation_date_time.year, poll.creation_date_time.month, poll.creation_date_time.day,
             poll.creation_date_time.hour, poll.creation_date_time.minute),
            (now.year, now.month, now.day, now.hour, now.minute))
        self.assertEqual(poll.state, 'REVIEWING')
        self.assertEqual(poll.publication_date, None)
        self.assertEqual(poll.admin_comment, '')
        self.assertSetEqual(set(c[0] for c in poll.choices.values_list('text')),
                            set(c['text'] for c in data['choices']))

    def test_if_logged_in_then_can_create(self):
        for user in self.ALL_USERS:
            self.login(user)
            res = self.create(data=self.create_data)
            self.assertStatusCode(res, 201)
            self.check_last_poll(user, self.create_data)

    def test_if_create_with_extra_fields_then_no_effect(self):
        for user in self.ALL_USERS:
            self.login(user)
            res = self.create(data=self.create_data_with_extra_fields)
            self.assertStatusCode(res, 201)
            self.check_last_poll(user, self.create_data)

    ##########
    # UPDATE #
    ##########

    update_data_simple = {
        'question': 'La nouvelle devise des Mines ?',
        'choices': [
            {'text': 'Fake it until you make it.'},
            {'text': 'Too much is not enough.'}
        ]
    }

    update_data_simple_with_extra_fields = update_data_simple.update({
        'user': '17bocquet',
        'state': 'ACCEPTED',
        'publication_date': date(2019, 1, 1),
        'admin_comment': 'Very good.'
    })

    update_data_admin = {
        'question': 'La nouvelle devise des Mines ?',
        'choices': [
            {'text': 'Fake it until you make it.'},
            {'text': 'Too much is not enough.'}
        ],
        'state': 'ACCEPTED',
        'publication_date': date(2019, 1, 1),
        'admin_comment': 'Very good.'
    }

    update_data_admin_with_extra_fields = update_data_admin.update({
        'user': '17bocquet',
    })

    def test_if_not_author_not_admin_then_cannot_update(self):
        self.login('17simple')

        polls = Poll.objects.exclude(user='17simple')

        for poll in polls:
            res = self.update(poll.id, data=self.update_data_simple)
            self.assertStatusCodeIn(res, [403, 404])

    def test_if_author_and_not_published_then_can_update_with_limited_data(self):
        self.login('17simple')

        polls = Poll.objects.filter(user='17simple')

        for poll in polls:
            if not poll.has_been_published:
                res = self.update(poll.id, data=self.update_data_simple)
                self.assertStatusCode(res, 200)

                updated_poll = Poll.objects.get(poll.id)
                self.assertEqual(updated_poll.question, self.update_data_simple['question'])
                self.assertSetEqual(set(c[0] for c in updated_poll.choices.values_list('text')),
                                    set(c['text'] for c in self.update_data_simple['choices']))

    def test_if_author_and_not_published_and_update_with_extra_fields_then_no_effect(self):
        self.login('17simple')

        polls = Poll.objects.filter(user='17simple')

        for poll in polls:
            if not poll.has_been_published:
                res = self.update(poll.id, data=self.update_data_simple_with_extra_fields)
                self.assertStatusCode(res, 200)

                updated_poll = Poll.objects.get(poll.id)
                self.assertEqual(updated_poll.question, self.update_data_simple_with_extra_fields['question'])
                self.assertSetEqual(set(c[0] for c in updated_poll.choices.values_list('text')),
                                    set(c['text'] for c in self.update_data_simple_with_extra_fields['choices']))
                self.assertTupleEqual(
                    (poll.user, poll.state, poll.publication_date, poll.admin_comment),
                    (updated_poll.user, updated_poll.state, updated_poll.publication_date, updated_poll.admin_comment))

    def test_if_author_and_published_then_cannot_update(self):
        self.login('17simple')

        polls = Poll.objects.filter(user='17simple')

        for poll in polls:
            if poll.has_been_published:
                res = self.update(poll.id, data=self.update_data_simple)
                self.assertStatusCode(res, 403)

    def test_if_admin_then_can_update_with_full_data(self):
        self.login('17admin')

        for poll in Poll.objects.all():
            res = self.update(poll.id, data=self.update_data_admin)
            self.assertStatusCode(res, 200)
            updated_poll = Poll.objects.get(poll.id)
            self.assertEqual(updated_poll.question, self.update_data_admin['question'])
            self.assertSetEqual(set(c[0] for c in updated_poll.choices.values_list('text')),
                                set(c['text'] for c in self.update_data_admin['choices']))
            self.assertEqual(poll.state, self.update_data_admin['state'])
            self.assertEqual(poll.publication_date, self.update_data_admin['publication_date'])
            self.assertEqual(poll.admin_comment, self.update_data_admin['comment'])

    def test_if_admin_and_update_with_extra_fields_then_no_effect(self):
        self.login('17admin')

        for poll in Poll.objects.all():
            res = self.update(poll.id, data=self.update_data_admin_with_extra_fields)
            self.assertStatusCode(res, 200)
            updated_poll = Poll.objects.get(poll.id)

            self.assertEqual(updated_poll.question, self.update_data_admin['question'])
            self.assertSetEqual(set(c[0] for c in updated_poll.choices.values_list('text')),
                                set(c['text'] for c in self.update_data_admin['choices']))
            self.assertEqual(poll.state, self.update_data_admin['state'])
            self.assertEqual(poll.publication_date, self.update_data_admin['publication_date'])
            self.assertEqual(poll.admin_comment, self.update_data_admin['comment'])

            self.assertEqual(poll.user, updated_poll.user)

    ###########
    # DESTROY #
    ###########

    def test_if_not_author_then_cannot_destroy(self):
        for user in self.ALL_USERS:
            for poll in Poll.objects.exclude(user=user):
                res = self.destroy(poll.id)
                self.assertStatusCode(res, 403)
                self.assertTrue(Poll.objects.filter(id=poll.id).exists())

    def test_if_author_and_not_published_then_can_destroy(self):
        for user in self.ALL_USERS:
            for poll in Poll.objects.filter(user=user):
                res = self.destroy(poll.id)
                self.assertStatusCode(res, 204)
                self.assertFalse(Poll.objects.filter(id=poll.id).exists())

    def test_if_author_and_published_then_cannot_destroy(self):
        for user in self.ALL_USERS:
            for poll in Poll.objects.filter(user=user):
                res = self.destroy(poll.id)
                self.assertStatusCode(res, 403)
                self.assertTrue(Poll.objects.filter(id=poll.id).exists())

    ###########
    # RESULTS #
    ###########

    def test_can_retrieve_results(self):
        for user in self.ALL_USERS:
            self.login(user)

            for poll in Poll.objects.filter(status='ACCEPTED', publication_date__lte=date.today())
                res = self.results(poll.id)
                self.assertStatusCode(res, 200)
                self.assertSetEqual(res.data.keys(),
                                    {'poll', 'results'})

    ########
    # VOTE #
    ########

    def test_if_valid_poll_then_can_vote(self):
        self.login('17admin')


    ##################
    # BUSINESS LOGIC #
    ##################

