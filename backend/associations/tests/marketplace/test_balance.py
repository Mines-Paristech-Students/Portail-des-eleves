import json
from decimal import Decimal

from associations.models import Transaction, Marketplace, Funding
from associations.tests.marketplace import *
from associations.views.marketplace import compute_balance
from authentication.models import User


class BalanceTestCase(BaseMarketPlaceTestCase):
    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_balance(self):
        res = self.get("/associations/marketplace/biero/balance/")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_balance(self):
        self.login("17simple")
        res = self.get("/associations/marketplace/biero/balance/17simple/")
        self.assertStatusCode(res, 200)

        content = json.loads(res.content)
        self.assertEqual(
            Decimal(content["balance"]),
            compute_balance(
                User.objects.get(pk="17simple"), Marketplace.objects.get(pk="biero")
            ),
        )

    def test_if_marketplace_admin_then_can_retrieve_balance_of_another_user(self):
        self.login("17market_biero")
        res = self.get("/associations/marketplace/biero/balance/17simple/")
        self.assertStatusCode(res, 200)

        content = json.loads(res.content)
        self.assertEqual(
            Decimal(content["balance"]),
            compute_balance(
                User.objects.get(pk="17simple"), Marketplace.objects.get(pk="biero")
            ),
        )

    def test_if_not_marketplace_admin_then_cannot_retrieve_balance_of_another_user(
        self,
    ):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            if user != "17simple":
                self.login(user)
                res = self.get("/associations/marketplace/biero/balance/17simple/")
                self.assertStatusCode(res, 403)

    ########
    # LIST #
    ########

    def test_if_logged_in_then_can_retrieve_balances(self):
        self.login("17simple")
        res = self.get("/associations/marketplace/balance/")
        self.assertStatusCode(res, 200)

        content = json.loads(res.content)
        for market_balance in content["balances"]:
            self.assertEqual(
                Decimal(market_balance["balance"]),
                compute_balance(
                    User.objects.get(pk="17simple"),
                    Marketplace.objects.get(pk=market_balance["marketplace"]),
                ),
            )

    def test_if_library_administrator_then_can_retrieve_all_users_balances(self):
        self.login("17market_biero")
        res = self.get("/associations/marketplace/biero/balance/")
        self.assertStatusCode(res, 200)

        content = json.loads(res.content)["balances"]

        for market_balance in content:
            self.assertEqual(market_balance["marketplace"], "biero")
            user_id = market_balance["user"]
            self.assertEqual(
                Decimal(market_balance["balance"]),
                compute_balance(
                    User.objects.get(pk=user_id),
                    Marketplace.objects.get(pk=market_balance["marketplace"]),
                ),
            )

    ##################
    # BUSINESS LOGIC #
    ##################

    def test_balance_is_correctly_computed(self):
        consumer = User.objects.get(pk="17consumer")
        market_biero = User.objects.get(pk="17market_biero")
        biero = Marketplace.objects.get(pk="biero")

        def check_funding(biero_funding):
            self.login(consumer.id)
            self.assertEqual(compute_balance(consumer, biero), biero_funding)

            biero_content = json.loads(
                self.get(
                    f"/associations/marketplace/biero/balance/{consumer.id}/"
                ).content
            )

            biero_balance = (
                0 if biero_content == [] else Decimal(biero_content["balance"])
            )
            self.assertEqual(biero_balance, biero_funding)

        # Check the initial balance in the database and in the API.
        check_funding(0)

        # Add some funding.
        self.login(market_biero.id)
        self.post(
            "/associations/fundings/",
            data={"user": consumer.id, "value": 10, "marketplace": "biero"},
        )
        self.post(
            "/associations/fundings/",
            data={"user": consumer.id, "value": 10, "marketplace": "biero"},
        )
        check_funding(20)

        # Refund the last biero funding.
        self.login(market_biero.id)
        funding_id = (
            Funding.objects.filter(marketplace="biero").order_by("id").last().id
        )
        self.patch(f"/associations/fundings/{funding_id}/", data={"status": "REFUNDED"})
        check_funding(10)

        # Buy things.
        self.login(consumer.id)
        self.post(
            "/associations/transactions/",
            data={"buyer": consumer.id, "product": 3, "quantity": 2},
        )
        check_funding(0)

        # Buy and cancel.
        self.post(
            "/associations/transactions/",
            data={"buyer": consumer.id, "product": 3, "quantity": 1},
        )
        self.patch(
            f"/associations/transactions/{Transaction.objects.order_by('id').last().id}/",
            {"status": "CANCELLED"},
        )
        check_funding(0)

        # Buy and have one administrator reject the transaction.
        self.post(
            "/associations/transactions/",
            data={"buyer": consumer.id, "product": 3, "quantity": 1},
        )
        self.login(market_biero.id)
        self.patch(
            f"/associations/transactions/{Transaction.objects.order_by('id').last().id}/",
            {"status": "REJECTED"},
        )
        check_funding(0)

        # Buy and have one administrator accept, deliver, then refund the transaction.
        self.login(consumer.id)
        self.post(
            "/associations/transactions/",
            data={"buyer": consumer.id, "product": 3, "quantity": 1},
        )

        self.login(market_biero.id)
        self.patch(
            f"/associations/transactions/{Transaction.objects.order_by('id').last().id}/",
            {"status": "ACCEPTED"},
        )
        check_funding(-5)

        self.login(market_biero.id)
        self.patch(
            f"/associations/transactions/{Transaction.objects.order_by('id').last().id}/",
            {"status": "DELIVERED"},
        )
        check_funding(-5)

        self.login(market_biero.id)
        self.patch(
            f"/associations/transactions/{Transaction.objects.order_by('id').last().id}/",
            {"status": "REFUNDED"},
        )
        check_funding(0)
