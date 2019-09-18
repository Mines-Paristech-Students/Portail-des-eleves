from associations.models import Association, Role
from associations.tests.marketplace import *
from authentication.models import User


class MarketplaceRolesTestCase(BaseMarketPlaceTestCase):
    def test_if_not_association_admin_then_cannot_add_marketplace_role(self):
        for user in ALL_USERS_EXCEPT_ADMIN_BIERO:
            self.login(user)
            self.assertFalse(Role.objects.get(pk=2).marketplace)
            res = self.patch('/roles/2/', data={'marketplace_permission': True})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertFalse(Role.objects.get(pk=2).marketplace)

    def test_if_association_admin_then_can_add_marketplace_role(self):
        user = '17admin_biero'
        self.login(user)
        self.assertTrue(User.objects.get(pk=user).get_role(Association.objects.get(pk='biero')).is_admin)

        self.assertFalse(Role.objects.get(pk=2).marketplace)
        res = self.patch('/roles/2/', data={'marketplace_permission': True})
        self.assertStatusCode(res, 200)
        self.assertTrue(Role.objects.get(pk=2).marketplace)

    def test_if_not_association_admin_then_cannot_remove_marketplace_role(self):
        for user in ALL_USERS_EXCEPT_ADMIN_BIERO:
            self.login(user)
            res = self.patch('/roles/1/', data={'marketplace_permission': False})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertTrue(Role.objects.get(pk=1).marketplace)

    def test_if_association_admin_then_can_remove_marketplace_role(self):
        self.login('17admin_biero')
        self.assertTrue(Role.objects.get(pk=1).marketplace)
        res = self.patch('/roles/1/', data={'marketplace_permission': False})
        self.assertStatusCode(res, 200)
        self.assertFalse(Role.objects.get(pk=1).marketplace)
