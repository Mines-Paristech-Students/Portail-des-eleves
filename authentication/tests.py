from django.test import TestCase
from authentication.models import User


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
