from datetime import datetime, timezone

from associations.models import Funding
from associations.tests.marketplace import *


class FundingTestCase(BaseMarketPlaceTestCase):
    funding = {"user": "17simple", "value": 42, "marketplace": "biero"}
    negative_funding = {"user": "17simple", "value": -42, "marketplace": "biero"}

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list_funding(self):
        res = self.get("/associations/fundings/")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_list_funding(self):
        self.login("17simple")
        res = self.get("/associations/fundings/")
        self.assertStatusCode(res, 200)

    def test_can_list_all_funding_even_from_disabled_marketplace(self):
        user = "17simple"
        self.login(user)

        marketplaces_id = set()
        valid = False
        for funding in Funding.objects.filter(user=user):
            marketplaces_id.add(funding.marketplace.id)
            valid = valid or not funding.marketplace.enabled
        self.assertTrue(
            valid,
            msg=f"To run, this test needs {user} to have a funding in a disabled market.",
        )

        res = self.get("/associations/fundings/")
        self.assertStatusCode(res, 200)
        self.assertSetEqual(set([x["marketplace"] for x in res.data]), marketplaces_id)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_funding(self):
        res = self.get("/associations/fundings/1/")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_funding(self):
        user = "17simple"
        self.login(user)

        for funding in Funding.objects.filter(user=user):
            res = self.get(f"/associations/fundings/{funding.id}/")
            self.assertStatusCode(res, 200)

    def test_if_funding_does_not_exist_then_404(self):
        self.login("17simple")
        res = self.get("/associations/fundings/42/")
        self.assertFalse(Funding.objects.filter(pk="42").exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    def test_if_not_marketplace_admin_then_cannot_create_funding(self):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            self.login(user)

            l = len(Funding.objects.all())
            res = self.post("/associations/fundings/", data=self.funding)
            self.assertStatusCode(res, 403, user_msg=user)
            self.assertEqual(l, len(Funding.objects.all()))

    def test_if_marketplace_admin_then_can_create_funding(self):
        self.login("17market_biero")  # Marketplace administrator.
        res = self.post("/associations/fundings/", data=self.funding)
        self.assertStatusCode(res, 201)

        last_funding = Funding.objects.last()
        self.assertEqual(last_funding.user.id, self.funding["user"])
        self.assertEqual(last_funding.value, self.funding["value"])
        self.assertEqual(last_funding.marketplace.id, self.funding["marketplace"])
        self.assertEqual(last_funding.status, "FUNDED")

    def test_cannot_create_funding_with_negative_value(self):
        self.login("17market_biero")  # Marketplace administrator.

        l = len(Funding.objects.all())
        res = self.post("/associations/fundings/", data=self.negative_funding)
        self.assertStatusCode(res, 400)
        self.assertEqual(l, len(Funding.objects.all()))

    ##########
    # UPDATE #
    ##########

    def test_if_not_marketplace_admin_then_cannot_update_funding(self):
        for user in ALL_USERS_EXCEPT_MARKET_ADMIN:
            self.login(user)

            for funding in Funding.objects.all():
                for data in [
                    {"user": "17simple"},
                    {"value": 42},
                    {"marketplace": "pdm"},
                    {"status": "REFUNDED"},
                    {"date": datetime(2018, 1, 3, 12, 00, 00, tzinfo=timezone.utc)},
                ]:
                    res = self.patch(f"/associations/fundings/{funding.id}/", data=data)
                    self.assertStatusCodeIn(res, [403, 404])

                    for key in data:
                        self.assertEqual(
                            getattr(funding, key),
                            getattr(Funding.objects.get(id=funding.id), key),
                            msg=f"User {user} managed to update Funding id {funding.id}.",
                        )

    def test_if_marketplace_admin_then_can_update_status_in_own_market(self):
        user = "17market_biero"
        self.login(user)

        for funding in Funding.objects.filter(marketplace="biero"):
            res = self.patch(
                f"/associations/fundings/{funding.id}/", data={"status": "FUNDED"}
            )
            self.assertStatusCode(res, 200)
            self.assertEqual("FUNDED", Funding.objects.get(id=funding.id).status)

            res = self.patch(
                f"/associations/fundings/{funding.id}/", data={"status": "REFUNDED"}
            )
            self.assertStatusCode(res, 200)
            self.assertEqual("REFUNDED", Funding.objects.get(id=funding.id).status)

    def test_if_marketplace_admin_then_cannot_update_something_else_than_status(self):
        user = "17market_biero"
        self.login(user)

        for funding in Funding.objects.filter(marketplace__id="biero"):
            for data in [
                {"user": "17simple"},
                {"value": 42},
                {"marketplace": "pdm"},
                {"date": datetime(2018, 1, 3, 12, 00, 00, tzinfo=timezone.utc)},
            ]:
                res = self.patch(f"/associations/fundings/{funding.id}/", data=data)
                self.assertStatusCode(res, 403, user_msg=data)

                for key in data:
                    self.assertEqual(
                        getattr(funding, key),
                        getattr(Funding.objects.get(id=funding.id), key),
                        msg=f"User {user} managed to update Funding id {funding.id}.",
                    )

    def test_if_marketplace_admin_then_cannot_update_other_market_funding(self):
        user = "17market_biero"
        self.login(user)

        for funding in Funding.objects.exclude(marketplace="biero"):
            for data in [
                {"user": "17simple"},
                {"value": 42},
                {"marketplace": "pdm"},
                {"status": "REFUNDED"},
                {"date": datetime(2018, 1, 3, 12, 00, 00, tzinfo=timezone.utc)},
            ]:
                res = self.patch(f"/associations/fundings/{funding.id}/", data=data)
                self.assertStatusCode(res, 404)

                for key in data:
                    self.assertEqual(
                        getattr(funding, key),
                        getattr(Funding.objects.get(id=funding.id), key),
                        msg=f"User {user} managed to update Funding id {funding.id}.",
                    )

    ##########
    # DELETE #
    ##########

    def test_cannot_delete_funding(self):
        for user in ALL_USERS:
            self.login(user)

            for funding in Funding.objects.all():
                res = self.delete(f"/associations/fundings/{funding.id}/")

                self.assertEqual(res.status_code, 403, msg=res)
                self.assertTrue(
                    Funding.objects.filter(id=funding.id).exists(),
                    msg=f"User {user} did manage to delete Funding id {funding.id}.",
                )
