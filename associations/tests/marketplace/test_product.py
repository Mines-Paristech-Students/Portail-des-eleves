from django.core.exceptions import ObjectDoesNotExist

from associations.models import Marketplace, Product
from associations.tests.marketplace import *


class ProductTestCase(BaseMarketPlaceTestCase):
    product = {'name': 'L’éco-cup', 'description': 'Une éco-cup qui a connu un destin tragique.', 'price': 5,
               'comment': 'Écrit par Léo Chabeauf', 'marketplace': 'biero'}

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_products(self):
        res = self.get('/products/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_products(self):
        self.login('17simple')
        res = self.get('/products/')
        self.assertStatusCode(res, 200)

    def test_if_marketplace_disabled_then_products_dont_show(self):
        self.login('17simple')
        res = self.get('/products/')
        self.assertStatusCode(res, 200)
        marketplaces = set([x['marketplace'] for x in res.data])
        self.assertNotIn('pdm', marketplaces)

    def test_if_marketplace_disabled_and_marketplace_admin_then_products_show(self):
        self.login('17market_pdm')
        res = self.get('/products/')
        self.assertStatusCode(res, 200)
        marketplaces = set([x['marketplace'] for x in res.data])
        self.assertIn('pdm', marketplaces)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_product(self):
        res = self.get('/products/1/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_product(self):
        self.login('17simple')
        res = self.get('/products/3/')
        self.assertStatusCode(res, 200)

    def test_if_marketplace_disabled_then_no_access_to_product(self):
        self.login('17simple')
        res = self.get('/products/4/')
        self.assertFalse(Marketplace.objects.get(pk='pdm').enabled)
        self.assertStatusCode(res, 403)

    def test_if_product_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('/products/42/')
        self.assertFalse(Product.objects.filter(pk='42').exists())
        self.assertStatusCode(res, 404)

    def test_if_marketplace_disabled_and_marketplace_admin_then_access_to_product(self):
        self.login('17market_pdm')
        res = self.get('/products/1/')
        self.assertFalse(Marketplace.objects.get(pk='pdm').enabled)
        self.assertStatusCode(res, 200)

    ##########
    # CREATE #
    ##########

    def test_if_not_marketplace_admin_then_cannot_create_product(self):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            self.login(user)
            res = self.post('/products/', data=self.product)
            self.assertStatusCode(res, 403, user_msg=user)
            self.assertRaises(ObjectDoesNotExist, Product.objects.get, name=self.product['name'])

    def test_if_marketplace_admin_then_can_create_product(self):
        self.login('17market_biero')  # Marketplace administrator.
        res = self.post('/products/', data=self.product)
        self.assertStatusCode(res, 201)
        self.assertTrue(Product.objects.filter(name=self.product['name']).exists())
        self.assertEqual(Product.objects.get(name=self.product['name']).description, self.product['description'])
        self.assertEqual(Product.objects.get(name=self.product['name']).price, self.product['price'])
        self.assertEqual(Product.objects.get(name=self.product['name']).comment, self.product['comment'])
        self.assertIn(Product.objects.get(name=self.product['name']),
                      Marketplace.objects.get(pk=self.product['marketplace']).products.all())

    ##########
    # UPDATE #
    ##########

    def test_if_not_marketplace_admin_then_cannot_update_product(self):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            self.login(user)
            res = self.patch('/products/3/',
                             data={'pk': 3, 'name': 'Jus de raisin', 'description': 'Le premier pas vers le vin.'})
            self.assertStatusCode(res, 403)
            self.assertEqual(Product.objects.get(pk=3).name, 'Jus de pomme')

    def test_if_marketplace_admin_then_can_update_product(self):
        self.login('17market_biero')
        data = {'pk': 3, 'name': 'Jus de raisin', 'description': 'Le premier pas vers le vin.'}
        res = self.patch('/products/3/', data)
        self.assertStatusCode(res, 200)
        self.assertEqual(Product.objects.get(pk=3).name, data['name'])
        self.assertEqual(Product.objects.get(pk=3).description, data['description'])

    def test_if_marketplace_admin_and_marketplace_disabled_then_can_update_product(self):
        self.login('17market_pdm')
        data = {'pk': 5, 'name': 'CHOCOLATINE', 'description': 'Bordel.'}
        res = self.patch('/products/5/', data)
        self.assertStatusCode(res, 200)
        self.assertEqual(Product.objects.get(pk=5).name, data['name'])
        self.assertEqual(Product.objects.get(pk=5).description, data['description'])

    ##########
    # DELETE #
    ##########

    def test_if_not_marketplace_admin_then_cannot_delete_product(self):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            self.login(user)
            res = self.delete('/products/3/')
            self.assertStatusCode(res, 403)
            self.assertTrue(Product.objects.filter(pk=3).exists())

    def test_if_marketplace_admin_then_can_delete_product(self):
        self.login('17market_biero')  # Marketplace administrator.
        res = self.delete('/products/3/')
        self.assertStatusCode(res, 204)
        self.assertFalse(Product.objects.filter(pk=3).exists())
