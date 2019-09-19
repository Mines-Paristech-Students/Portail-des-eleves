from django.core.exceptions import ObjectDoesNotExist

from associations.models import Association, Marketplace
from associations.tests.marketplace import *


class MarketplaceTestCase(BaseMarketPlaceTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_marketplaces(self):
        res = self.get('/marketplace/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_marketplaces(self):
        self.login('17simple')
        res = self.get('/marketplace/')
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_marketplace(self):
        res = self.get('/marketplace/biero/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_marketplace(self):
        self.login('17simple')
        res = self.get('/marketplace/biero/')
        self.assertStatusCode(res, 200)

    def test_if_marketplace_disabled_then_no_access_to_marketplace(self):
        self.login('17simple')
        res = self.get('/marketplace/pdm/')
        self.assertFalse(Marketplace.objects.get(pk='pdm').enabled)
        self.assertStatusCode(res, 403)

    def test_if_marketplace_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('/marketplace/bde/')
        self.assertFalse(Marketplace.objects.filter(pk='bde').exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    def test_if_not_marketplace_admin_then_cannot_create_marketplace(self):
        for user in ALL_USERS:
            if user != '17market_bde':
                self.login(user)
                res = self.post('/marketplace/',
                                data={'id': 'bde', 'enabled': 'true', 'association': 'bde', 'products': []})
                self.assertStatusCode(res, 403)
                self.assertRaises(ObjectDoesNotExist, Marketplace.objects.get, pk='bde')

    def test_if_marketplace_admin_then_can_create_own_marketplace(self):
        self.login('17market_bde')  # Marketplace administrator.
        res = self.post('/marketplace/',
                        data={'id': 'bde', 'enabled': 'true', 'products': [], 'association': 'bde'})
        self.assertStatusCode(res, 201)
        self.assertTrue(Marketplace.objects.filter(pk='bde').exists())
        self.assertEqual(Association.objects.get(pk='bde').marketplace, Marketplace.objects.get(pk='bde'))

    ##########
    # UPDATE #
    ##########

    def test_if_not_marketplace_admin_then_cannot_update_marketplace(self):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            self.login(user)
            res = self.patch('/marketplace/biero/', data={'enabled': 'false'})
            self.assertStatusCode(res, 403)
            self.assertTrue(Marketplace.objects.get(pk='biero').enabled)

    def test_if_marketplace_admin_then_can_update_marketplace(self):
        self.login('17market_biero')
        res = self.patch('/marketplace/biero/', data={'enabled': 'false'})
        self.assertStatusCode(res, 200)
        self.assertFalse(Marketplace.objects.get(pk='biero').enabled)

    ##########
    # DELETE #
    ##########

    def test_if_not_marketplace_admin_then_cannot_delete_marketplace(self):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            self.login(user)
            res = self.delete('/marketplace/biero/')
            self.assertStatusCode(res, 403)
            self.assertTrue(Marketplace.objects.filter(pk='biero').exists())

    def test_if_marketplace_admin_then_can_delete_own_marketplace(self):
        self.login('17market_biero')  # Marketplace administrator.
        res = self.delete('/marketplace/biero/')
        self.assertStatusCode(res, 204)
        self.assertRaises(ObjectDoesNotExist, Marketplace.objects.get, pk='biero')
