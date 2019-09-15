from datetime import date

from authentication.models import User
from authentication.serializers import UserSerializer
from backend.tests_utils import BackendTestCase

from rest_framework.renderers import JSONRenderer


class ProfileTestCase(BackendTestCase):
    fixtures = ['test_authentication.yaml']

    def assertContentIsEqualToUser(self, res, user):
        self.assertEqual(res.content, JSONRenderer().render(UserSerializer(user).data))

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_user(self):
        res = self.get('users/17bocquet/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_user(self):
        self.login('17simple')
        res = self.get('users/17bocquet/')
        self.assertStatusCode(res, 200)
        self.assertContentIsEqualToUser(res, User.objects.get(pk='17bocquet'))

    def test_if_logged_in_then_can_retrieve_current_user(self):
        self.login('17simple')
        res = self.get('users/current/')
        self.assertStatusCode(res, 200)
        self.assertContentIsEqualToUser(res, User.objects.get(pk='17simple'))

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list_user(self):
        res = self.get('users/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_list_user(self):
        self.login('17simple')
        res = self.get('users/')
        self.assertStatusCode(res, 200)

    ##########
    # CREATE #
    ##########

    new_user_data = {
        'id': '17test',
        'password': 'pbkdf2_sha256$100000$tos6gO0V3tNL$Vd14vNq3N5MwGX6TsvBV0RW+DQzGpy3OGfKqCtL3kls=',
        'first_name': 'Test',
        'last_name': 'Test',
        'email': 'test@mpt.fr',
        'is_admin': 'false',
        'year_of_entry': 2017
    }

    def test_cannot_create_user(self):
        res = self.post('users/', self.new_user_data)
        self.assertStatusCode(res, 401)

        self.login('17simple')
        res = self.post('users/', self.new_user_data)
        self.assertStatusCode(res, 403)

        self.login('17admin')
        res = self.post('users/', self.new_user_data)
        self.assertStatusCode(res, 403)

    ##########
    # UPDATE #
    ##########

    # TODO: test the edited fields…
    limited_edit_user_data = {
        'nickname': 'Nick',
        'phone': '123456',
        'room': '123',
        'address': '60 boulevard SM',
        'city_of_origin': 'Paris',
        'option': 'Mécatro',
        'sports': 'Pichage',
        'roommate': ['17bocquet'],
        'minesparent': ['17wan-fat'],
    }

    def test_if_user_then_can_edit_own_profile_with_limited_data(self):
        self.login('17simple')
        res = self.patch('users/17simple/', data=self.limited_edit_user_data)
        self.assertStatusCode(res, 200)

        user = User.objects.get(pk='17simple')
        for field in self.limited_edit_user_data:
            if field in ['roommate', 'minesparent']:
                self.assertEqual([u.id for u in user.__getattribute__(field).all()], self.limited_edit_user_data[field])
            else:
                self.assertEqual(user.__getattribute__(field), self.limited_edit_user_data[field])

    def test_if_not_admin_then_cannot_edit_other_user_profile(self):
        self.login('17simple')
        res = self.patch('users/17bocquet/', data=self.limited_edit_user_data)
        self.assertStatusCode(res, 403)

    def test_if_admin_then_can_edit_other_user_profile(self):
        self.login('17admin')
        res = self.patch('users/17simple/', data=self.full_edit_user_data)
        self.assertStatusCode(res, 200)

        user = User.objects.get(pk='17simple')
        for field in self.full_edit_user_data:
            if field in ('roommate', 'minesparent'):
                self.assertEqual([u.id for u in user.__getattribute__(field).all()], self.full_edit_user_data[field])
            else:
                self.assertEqual(user.__getattribute__(field), self.full_edit_user_data[field])

    ##########
    # DELETE #
    ##########

    def test_cannot_delete_user(self):
        self.login('17simple')
        res = self.delete('users/17simple/')
        self.assertStatusCode(res, 403)
        self.assertTrue(User.objects.filter(pk='17simple').exists())

        self.login('17admin')
        res = self.delete('users/17simple/')
        self.assertStatusCode(res, 403)
        self.assertTrue(User.objects.filter(pk='17simple').exists())
