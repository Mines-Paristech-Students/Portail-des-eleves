import json
from datetime import datetime

from django.test import TestCase
from django.urls import reverse

from authentication.models import User
from backend.tests_utils import BackendTestCase

class AuthenticationTestCase(TestCase):
    """
    Test the authentication logic.
    TODO(Florian) More to come
    """

    def setUp(self):
        User.objects.create_user(
            '15veaux', 'Florian', 'Veaux', 'florian.veaux@mines-paristech.fr',
            'password', '1996-08-28'
        )

    def test_user(self):
        self.assertEqual(User.objects.count(), 1)

class BirthdaysTestCase(BackendTestCase):
    """Test the birthdays endpoint logic
    """

    fixtures = ['birthdays_test.json']

    def setUp(self):
        self.user = self.create_and_login_user('15veaux', admin=True)

    def test_birthdays(self):
        number_of_days = 20
        url = reverse('get_birthdays', kwargs={'days':number_of_days})
        bd = json.loads(self.client.get(url).content)['birthdays']
        dates = [bd[i]['date'] for i in range(len(bd))]

        self.assertEqual(
            len(dates),
            number_of_days,
        )
        self.assertListEqual(
            [len(bd[i]['users']) for i in range(number_of_days)],
            [5] * number_of_days,
        )
        self.assertTrue(
            all(
                datetime.strptime(dates[i], "%Y-%m-%d").date() < datetime.strptime(dates[i+1], "%Y-%m-%d").date()
                for i in range(number_of_days - 1)
            ),
            "Birthdays are not sorted correctly"
        )
