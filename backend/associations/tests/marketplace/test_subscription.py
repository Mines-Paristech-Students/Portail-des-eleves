from associations.tests.marketplace.base_test_marketplace import BaseMarketPlaceTestCase


class SubscriptionTestCase(BaseMarketPlaceTestCase):
    #########
    #  GET  #
    #########

    def test_can_access_to_its_subscriber_status(self):
        self.login("17simple")
        res = self.get("/associations/marketplace/biero/subscription/17simple/")
        self.assertStatusCode(res, 200)

    def test_not_subscriber_by_default(self):
        self.login("17simple")
        res = self.get("/associations/marketplace/biero/subscription/17simple/")
        self.assertEqual(res.data["subscriber"], False)

    #########
    # PATCH #
    #########

    def test_if_admin_then_can_change_subscription_of_an_user(self):
        self.login("17market_biero")
        res = self.patch(
            "/associations/marketplace/biero/subscription/17simple/",
            data={"subscriber": "true"},
        )
        self.assertStatusCode(res, 200)
        self.assertEqual(res.data["subscriber"], True)
        verif = self.get("/associations/marketplace/biero/subscription/17simple/")
        self.assertEqual(verif.data["subscriber"], True)

    def test_if_not_admin_then_cannot_change_subscription_of_an_user(self):
        self.login("17simple")
        res = self.patch(
            "/associations/marketplace/biero/subscription/17simple/",
            data={"subscriber": "false"},
        )
        self.assertStatusCode(res, 401)
