from django.test import TestCase
from authentication.models import Student


class AuthenticationTestCase(TestCase):
    """
    Test the authentication logic.
    TODO(Florian) More to come
    """
    def setUp(self):
        Student.objects.create_user(
            '15veaux', 'Florian', 'Veaux', 'florian.veaux@mines-paristech.fr',
            'password', '1996-08-28'
        )

    def test_student(self):
        self.assertEqual(Student.objects.count(), 1)
