from associations.models.association import Association, Role
from associations.tests.library.base_test_library import *
from authentication.models.user import User


class LibraryRolesTestCase(BaseLibraryTestCase):
    def test_if_not_association_admin_then_cannot_add_library_role(self):
        for user in ALL_USERS_EXCEPT_ADMIN_BD_TEK:
            self.login(user)
            self.assertFalse(Role.objects.get(pk=2).library)
            res = self.patch('roles/2/', data={'library': True})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertFalse(Role.objects.get(pk=2).library)

    def test_if_association_admin_then_can_add_library_role(self):
        user = '17admin_bd-tek'
        self.login(user)
        self.assertTrue(User.objects.get(pk=user).get_role(Association.objects.get(pk='bd-tek')).is_admin)

        self.assertFalse(Role.objects.get(pk=2).library)
        res = self.patch('roles/2/', data={'library': True})
        self.assertStatusCode(res, 200)
        self.assertTrue(Role.objects.get(pk=2).library)

    def test_if_not_association_admin_then_cannot_remove_library_role(self):
        for user in ALL_USERS_EXCEPT_ADMIN_BD_TEK:
            self.login(user)
            res = self.patch('roles/1/', data={'library': False})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertTrue(Role.objects.get(pk=1).library)

    def test_if_association_admin_then_can_remove_library_role(self):
        self.login('17admin_bd-tek')
        self.assertTrue(Role.objects.get(pk=1).library)
        res = self.patch('roles/1/', data={'library': False})
        self.assertStatusCode(res, 200)
        self.assertFalse(Role.objects.get(pk=1).library)
