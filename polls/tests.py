from datetime import timedelta, date

from django.utils import timezone
from django.urls import reverse

from rest_framework import status
from rest_framework.exceptions import NotAuthenticated

from backend.tests_utils import BaseTestCase
from authentication.models import User
from polls.models import Poll, Choice


class PollTestCase(BaseTestCase):
    """Defines some helpful functions for testing the poll application."""

    DUMMY_QUESTION = 'A question?'
    DUMMY_CHOICES = ['Choice 1', 'Choice 2']

    def submit_poll(self, question, choices, silent=False):
        """
        Submit a poll to polls-submit.

        :param str question: the question.
        :param list choices: a list of str.
        :param bool silent: if True, a NotAuthenticated exception will be raised if the POST return 403 (sometimes,
        this could be a wanted behaviour).
        :returns: the response from polls-submit.
        """

        url = reverse('polls-submit')
        data = {
            'question': question,
            'choices': [{'text': choice} for choice in choices]
        }

        response = self.client.post(url, data, format='json')

        if not silent and response.status_code == status.HTTP_401_UNAUTHORIZED:
            raise NotAuthenticated()

        return response

    def submit_dummy_poll(self, silent=False):
        """
        Shortcut to create a dummy poll.
        :return: the response from polls-submit.
        """

        return self.submit_poll(
            self.DUMMY_QUESTION,
            self.DUMMY_CHOICES,
            silent
        )

    def create_poll(self, question, user_id, choices=(), state='ACCEPTED', start_date_offset=-10):
        """
        Create a poll.

        :param str question: the question.
        :param str user_id: the id of the author.
        :param list choices: a list of texts for the choices.
        :param str state: choose among ('REVIEWING', 'REJECTED', 'ACCEPTED')
        :param int start_date_offset: the number of days as publication_date = now() + start_date_offset
        :return Poll: the created poll object.
        """

        now = date.today()

        poll = Poll.objects.create(
            user=User.objects.get(id=user_id),
            question=question,
            state=state,
            publication_date=now + timedelta(days=start_date_offset),
        )

        for choice_text in choices:
            Choice.objects.create(
                text=choice_text,
                poll=poll,
            )

        return poll


class PollModelTest(PollTestCase):
    def test_poll_was_published(self):
        """has_been_published() returns True for a old poll"""
        old_time = date.today() - timedelta(days=1)
        old_poll = Poll(state='ACCEPTED', publication_date=old_time - timedelta(days=1))
        self.assertTrue(old_poll.has_been_published())

    def test_accepted_poll_is_published(self):
        """
        has_been_published() returns True for a poll whose state is ACCEPTED and whose publication_date is <= today
        """
        old_time = date.today() - timedelta(days=1)
        poll = Poll(state='ACCEPTED', publication_date=old_time)
        self.assertTrue(poll.has_been_published())

    def test_poll_will_be_published(self):
        """has_been_published() returns False for a poll whose publication_date is set on the future."""
        future_time = date.today() + timedelta(days=1)
        future_poll = Poll(publication_date=future_time)
        self.assertFalse(future_poll.has_been_published())

    def test_poll_rejected_state(self):
        """has_been_published() returns False for a poll whose state is REJECTED."""
        old_time = date.today() - timedelta(days=1)
        poll = Poll(state='REJECTED', publication_date=old_time)
        self.assertFalse(poll.has_been_published())

    def test_poll_reviewing_state(self):
        """is_publhas_been_publishedished() returns False for a poll whose state is REVIEWING."""
        old_time = date.today() - timedelta(days=1)
        poll = Poll(state='REVIEWING', publication_date=old_time)
        self.assertFalse(poll.has_been_published())

    def test_poll_no_state(self):
        """has_been_published() returns False for a poll which has no state."""
        old_time = date.today() - timedelta(days=1)
        poll = Poll(publication_date=old_time)
        self.assertFalse(poll.has_been_published())


class ListSubmittedPollsTest(PollTestCase):
    def test_not_authenticated(self):
        """Return 403 as the user is not authenticated."""
        response = self.client.get(reverse('polls-submitted'))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_no_polls(self):
        """Return 200 and an empty polls list."""
        self.create_and_login_user(admin=False)

        response = self.client.get(reverse('polls-submitted'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_with_two_users(self):
        """Each user is returned 200 and only its full, submitted poll."""
        self.create_and_login_user(username='user_1', admin=False)
        self.submit_poll('user_1\'s poll', choices=['Choice'])
        self.logout()

        self.create_and_login_user(username='user_2', admin=False)
        self.submit_poll('user_2\'s poll', choices=['Choice'])
        self.logout()

        # Test user 1
        self.login('user_1')
        response_1 = self.client.get(reverse('polls-submitted'))
        self.logout()

        self.assertEqual(response_1.status_code, status.HTTP_200_OK)
        self.assertContains(response_1, 'user_1')
        self.assertNotContains(response_1, 'user_2')
        self.assertSetEqual(
            set(response_1.data[0].keys()),
            {'id', 'url', 'question', 'user', 'creation_date_time', 'state', 'publication_date',
             'admin_comment', 'choices'}
        )
        self.assertSetEqual(
            set(response_1.data[0]['choices'][0].keys()),
            {'id', 'text', 'poll'}
        )

        # Test user 2
        self.login('user_2')
        response_2 = self.client.get(reverse('polls-submitted'))
        self.logout()

        self.assertEqual(response_2.status_code, status.HTTP_200_OK)
        self.assertContains(response_2, 'user_2')
        self.assertNotContains(response_2, 'user_1')
        self.assertSetEqual(
            set(response_2.data[0].keys()),
            {'id', 'url', 'question', 'user', 'creation_date_time', 'state', 'publication_date',
             'admin_comment', 'choices'}
        )
        self.assertSetEqual(
            set(response_2.data[0]['choices'][0].keys()),
            {'id', 'text', 'poll'}
        )


class ListAllPollsTest(PollTestCase):
    def test_not_admin(self):
        """Return 403 as the user is not an admin user."""
        self.create_and_login_user(admin=False)
        response = self.client.get(reverse('polls-all'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_no_polls(self):
        """Return 200 and an empty polls list."""
        self.create_and_login_user(admin=True)

        response = self.client.get(reverse('polls-all'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_with_simple_users_submission(self):
        """Return 200 and the submission of the users."""
        self.create_and_login_user(username='user_1', admin=False)
        self.submit_poll('user_1\'s poll', choices=['Choice'])
        self.logout()

        self.create_and_login_user(username='user_2', admin=False)
        self.submit_poll('user_2\'s poll', choices=['Choice'])
        self.logout()

        self.create_and_login_user(admin=True)
        response = self.client.get(reverse('polls-all'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'user_1')
        self.assertContains(response, 'user_2')
        self.assertSetEqual(
            set(response.data[0].keys()),
            {'id', 'url', 'question', 'user', 'creation_date_time', 'state', 'publication_date',
             'admin_comment', 'choices'}
        )
        self.assertSetEqual(
            set(response.data[0]['choices'][0].keys()),
            {'id', 'text', 'poll'}
        )


class RetrievePollTest(PollTestCase):
    def test_not_authenticated(self):
        """Return 403 as the user is not authenticated."""
        self.create_and_login_user(admin=False)
        self.submit_dummy_poll()
        self.logout()

        poll_id = Poll.objects.latest('creation_date_time').id
        response = self.client.get(reverse('polls-retrieve', kwargs={'id': poll_id}))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unknown_poll(self):
        """Return 404."""
        self.create_and_login_user(admin=False)

        response = self.client.get(reverse('polls-retrieve', kwargs={'id': 42}))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_simple_user_own_poll(self):
        """Return 200 and the user's poll, with all the fields."""
        self.create_and_login_user(admin=False)
        self.submit_dummy_poll()

        poll_id = Poll.objects.latest('creation_date_time').id
        response = self.client.get(reverse('polls-retrieve', kwargs={'id': poll_id}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, self.DUMMY_QUESTION)
        for choice in self.DUMMY_CHOICES:
            self.assertContains(response, choice)
        self.assertSetEqual(
            set(response.data.keys()),
            {'id', 'url', 'question', 'user', 'creation_date_time', 'state', 'publication_date',
             'admin_comment', 'choices'}
        )
        self.assertSetEqual(
            set(response.data['choices'][0].keys()),
            {'id', 'text', 'poll'}
        )

    def test_simple_user_published_poll(self):
        """Return 200 and the restricted version of a poll submitted by another user."""
        # A first user create the poll. Directly set its state as ACCEPTED.
        self.create_user(username='author', admin=False)
        self.create_poll(self.DUMMY_QUESTION, 'author', self.DUMMY_CHOICES, 'ACCEPTED', start_date_offset=-10)
        self.logout()

        # Login as a different user and retrieve the poll.
        self.create_and_login_user(username='user', admin=False)

        poll_id = Poll.objects.latest('creation_date_time').id
        response = self.client.get(reverse('polls-retrieve', kwargs={'id': poll_id}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, self.DUMMY_QUESTION)
        for choice in self.DUMMY_CHOICES:
            self.assertContains(response, choice)
        self.assertSetEqual(
            set(response.data.keys()),
            {'id', 'url', 'question', 'choices'}
        )
        self.assertSetEqual(
            set(response.data['choices'][0].keys()),
            {'id', 'text', 'poll'}
        )

    def test_simple_user_not_published_poll(self):
        """Return 404."""
        # A first user create the poll.
        self.create_and_login_user(username='author', admin=False)
        self.submit_dummy_poll()
        self.logout()

        # Login as a different user and try to retrieve the poll.
        self.create_and_login_user(username='user', admin=False)

        poll_id = Poll.objects.latest('creation_date_time').id
        response = self.client.get(reverse('polls-retrieve', kwargs={'id': poll_id}))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin(self):
        """Return 200 and the full version of the poll."""
        # A first user create the poll.
        self.create_and_login_user(username='author', admin=False)
        self.submit_dummy_poll()
        self.logout()

        # Login as an admin and retrieve the poll.
        self.create_and_login_user(admin=True)

        poll_id = Poll.objects.latest('creation_date_time').id
        response = self.client.get(reverse('polls-retrieve', kwargs={'id': poll_id}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, self.DUMMY_QUESTION)
        for choice in self.DUMMY_CHOICES:
            self.assertContains(response, choice)
        self.assertSetEqual(
            set(response.data.keys()),
            {'id', 'url', 'question', 'user', 'creation_date_time', 'state', 'publication_date',
             'admin_comment', 'choices'}
        )
        self.assertSetEqual(
            set(response.data['choices'][0].keys()),
            {'id', 'text', 'poll'}
        )


class SubmitPollTest(PollTestCase):
    def test_not_authenticated(self):
        """
        Test a submission without authentication.
        The view should return 403.
        """
        response = self.submit_dummy_poll(silent=True)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Poll.objects.count(), 0)

    def test_submit_poll(self):
        """
        Test the submission of a poll object.
        The view should return 201 and one object should be created, with the specified properties.
        """
        self.create_and_login_user(admin=False)

        # Submit the poll and test the 201 response.
        response = self.submit_poll(self.DUMMY_QUESTION, self.DUMMY_CHOICES)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Get the poll's id.
        poll_id = Poll.objects.latest('creation_date_time').id

        # Test the Poll table.
        self.assertEqual(Poll.objects.count(), 1)
        self.assertEqual(Poll.objects.get(id=poll_id).question, self.DUMMY_QUESTION)

        # Test the Choice table.
        choices = Choice.objects.filter(poll=poll_id)
        # Since we do not know the order of the choices, we use sets.
        self.assertEqual(
            set([choice.text for choice in choices]),
            set(self.DUMMY_CHOICES),
        )

    def test_extra_fields(self):
        """Return 201 and only add the question field and the choices field to the database."""
        self.create_and_login_user(username='hacker', admin=False)

        url = reverse('polls-submit')
        data = {
            'question': self.DUMMY_QUESTION,
            'choices': [{'text': choice} for choice in self.DUMMY_CHOICES],
            'state': 'ACCEPTED',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Test the Poll table.
        poll_id = Poll.objects.latest('id').id
        self.assertEqual(Poll.objects.count(), 1)
        self.assertEqual(Poll.objects.get(id=poll_id).question, self.DUMMY_QUESTION)
        self.assertEqual(Poll.objects.get(id=poll_id).state, 'REVIEWING')

        # Test the Choice table.
        choices = Choice.objects.filter(poll=poll_id)
        # Since we do not know the order of the choices, we use sets.
        self.assertEqual(
            set([choice.text for choice in choices]),
            set(self.DUMMY_CHOICES),
        )


class UpdatePollTest(PollTestCase):
    def test_not_authenticated(self):
        """Return 403 as the user is not authenticated."""
        self.create_and_login_user(admin=False)
        self.submit_dummy_poll()
        self.logout()

        url = reverse('polls-update', kwargs={'id': 4})
        data = {
            'question': 'Other question',
        }
        response = self.client.patch(
            url,
            data,
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_not_admin(self):
        """Return 403 as the user is not an admin."""
        self.create_and_login_user(admin=False)
        self.submit_dummy_poll()

        url = reverse('polls-update', kwargs={'id': 1})
        data = {
            'question': 'Other question',
        }
        response = self.client.patch(
            url,
            data,
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_update_question(self):
        """Return 200 and correctly update the poll's question."""
        # Create the poll.
        self.create_and_login_user(admin=True)
        self.submit_dummy_poll()

        # Update it.
        poll_id = Poll.objects.latest('creation_date_time').id
        url = reverse('polls-update', kwargs={'id': poll_id})
        data = {
            'question': 'Another question?',
        }
        response = self.client.patch(
            url,
            data,
            format='json'
        )

        # Test.
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Poll.objects.get(id=poll_id).question, data['question'])

    def test_admin_update_state(self):
        """Return 200 and correctly update the poll's state."""
        # Create the poll.
        self.create_and_login_user(admin=True)
        self.submit_dummy_poll()

        # Update it.
        poll_id = Poll.objects.latest('creation_date_time').id
        url = reverse('polls-update', kwargs={'id': poll_id})
        data = {
            'state': 'REVIEWING',
        }
        response = self.client.patch(
            url,
            data,
            format='json'
        )

        # Test.
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Poll.objects.get(id=poll_id).state, data['state'])

    def test_admin_update_date(self):
        """Return 200 and correctly update the poll's date."""
        # Create the poll.
        self.create_and_login_user(admin=True)
        self.submit_dummy_poll()

        # Update it.
        poll_id = Poll.objects.latest('creation_date_time').id
        url = reverse('polls-update', kwargs={'id': poll_id})
        data = {
            'publication_date': date(day=1, month=1, year=2018)
        }
        response = self.client.patch(
            url,
            data,
            format='json'
        )

        # Test.
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            Poll.objects.get(id=poll_id).publication_date,
            data['publication_date'],
        )
