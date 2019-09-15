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
            'password', '1996-08-28', 15
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
        url = reverse('get_birthdays', kwargs={'days': number_of_days})
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
                datetime.strptime(dates[i], "%Y-%m-%d").date() < datetime.strptime(dates[i + 1], "%Y-%m-%d").date()
                for i in range(number_of_days - 1)
            ),
            "Birthdays are not sorted correctly"
        )


class ProfileTestCase(BackendTestCase):
    fixtures = ['test_authentication.yaml']

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_401(self):
        res = self.get('user/17bocquet/')
        self.assertStatusCode(res, 401)

    ##########
    # UPDATE #
    ##########
    
    def test_if_user_then_can_edit_own_profile(self):
        self.login('17simple')
        new_data = {'first_name': 'Simple',
                    'last_name': 'Simple',
                    'email': 'simple',
                    'is_admin': 'false',
                    'promo': '17', }
        res = self.patch('user/17simple/', data=new_data)
        self.assertStatusCode(res, 200)

        user = User.objects.get(pk='17simple')
        for field in new_data:
            self.assertEqual(user.__getattribute__(field), new_data[field])

    def test_if_not_admin_then_cannot_edit_other_user_profile(self):
        self.login('17simple')
        res = self.patch('user/17bocquet/',
                         {'pk': '17bocquet',
                          'room': '208'})
        self.assertStatusCode(res, 403)
        self.assertNotEqual(User.objects.get(pk='17bocquet').room, '208')

    def test_if_admin_then_can_edit_other_user_profile(self):
        self.login('17admin')
        new_data = {'first_name': 'Simple',
                    'last_name': 'Simple',
                    'email': 'simple',
                    'is_admin': 'false',
                    'promo': '17', }
        res = self.patch('user/17simple/', data=new_data)
        self.assertStatusCode(res, 200)

        user = User.objects.get(pk='17simple')
        for field in new_data:
            self.assertEqual(user.__getattribute__(field), new_data[field])
