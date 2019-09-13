import json

from django.core.exceptions import ObjectDoesNotExist

from associations.models import Association, Marketplace
from associations.tests.marketplace import *


class OrderTestCase(BaseMarketPlaceTestCase):
    def make_order(self):
        self.login("16leroy")
        res = self.client.post("/api/v1/orders/", {"products": [
            {"id": 2, "quantity": 2},
            {"id": 3, "quantity": 4}
        ]}, format='json', content_type='application/json')

        self.assertEqual(res.status_code, 200)

        return res

    def test_make_order(self):
        res = self.make_order()
        self.assertEqual(res.status_code, 200)

        res = self.client.get("/api/v1/orders/?marketplace=biero", format='json', content_type='application/json')

        self.assertEqual(res.status_code, 200)
        res = json.loads(res.content)
        self.assertEqual(len(res), 2)
        res = res[0]
        self.assertEqual(res["buyer"], "16leroy")
        self.assertEqual(res["product"]["id"], 3)
        self.assertEqual(res["quantity"], 4)

    def test_cannot_access_product_management_if_not_in_team(self):
        self.make_order()

        res = self.client.post("/api/v1/products/", {
            "name": "Nouveau produit",
            "price": 3.0,
            "description": "",
            "marketplace": "biero",
            "number_left": 10,
            "still_in_the_catalogue": True,
            "orderable_online": True
        }, format='json', content_type='application/json')
        self.assertEqual(res.status_code, 403)

        res = self.client.put("/api/v1/products/1/", format='json', content_type='application/json')
        self.assertEqual(res.status_code, 403)

        res = self.client.delete("/api/v1/products/1/", format='json', content_type='application/json')
        self.assertEqual(res.status_code, 403)

    def test_cannot_see_others_orders(self):
        self.make_order()

        self.login("17wan-fat")
        res = self.client.get("/api/v1/orders/?marketplace=biero", format='json', content_type='application/json')
        self.assertEqual(json.loads(res.content), [])

        self.login("16leroy")
        res = self.client.get("/api/v1/orders/?marketplace=biero", format='json', content_type='application/json')
        self.assertNotEqual(json.loads(res.content), [])

    def test_balance_is_correcly_computed(self):
        self.make_order()  # leroy orders but nothing is validated
        self.login("16leroy")  # the orders are now taken into account

        res = json.loads(self.client.get("/api/v1/marketplace/biero/balance/").content)
        self.assertEqual(res["user"], "16leroy")
        self.assertEqual(float(res["balance"]), 0)
        self.login("17bocquet")  # wan fat validates
        orders = json.loads(self.client.get("/api/v1/orders/?marketplace=biero").content)
        for order in orders:
            res = self.client.patch(
                "/api/v1/orders/{}/".format(order.get("id")),
                {"status": "DELIVERED"}, format='json',
                content_type='application/json'
            )
            self.assertEqual(res.status_code, 200)
        self.login("16leroy")  # the orders are now taken into account

        res = json.loads(self.client.get("/api/v1/marketplace/biero/balance/").content)
        self.assertEqual(res["user"], "16leroy")
        self.assertEqual(float(res["balance"]), -51.0)  # 4 * 12 + 2 * 1.5 = 51

    def test_add_money_to_balance_only_for_staff(self):
        self.login("16leroy")

        res = self.client.put("/api/v1/marketplace/biero/balance/17wan-fat", {"amount": 300}, format='json',
                              content_type='application/json')
        self.assertEqual(res.status_code, 403)

    def test_cannot_access_others_tabs_if_not_staff(self):
        self.login("16leroy")

        res = self.client.get("/api/v1/marketplace/biero/balance/17wan-fat")
        self.assertEqual(res.status_code, 403)

    def test_add_money_to_balance_taken_into_account(self):
        self.login("17bocquet")

        res = self.client.put("/api/v1/marketplace/biero/balance/16leroy", {"amount": 300}, format='json',
                              content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.content), {"status": "ok"})

        res = self.client.get("/api/v1/marketplace/biero/balance/16leroy", format='json',
                              content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(float(json.loads(res.content)["balance"]), 300.0)

        self.login("16leroy")
        res = self.client.get("/api/v1/marketplace/biero/balance/")
        res = json.loads(res.content)
        self.assertEqual(float(res["balance"]), 300.0)

    def test_cannot_order_more_than_there_is(self):
        pass

    def test_cannot_order_for_someone_else(self):
        pass
