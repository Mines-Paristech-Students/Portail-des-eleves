from django.urls import reverse
from django.test import TestCase

from rest_framework import status

from authentication.models import User
from backend.tests import BackendTestCase


class AuthenticationTest(BackendTestCase):
    def test_authentication(self):
        response = self.create_and_login_user()
        self.assertEqual(response.status_code, status.HTTP_200_OK)


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
