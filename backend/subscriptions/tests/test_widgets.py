from associations.models import Marketplace
from associations.views.marketplace import compute_balance
from authentication.views.birthdays import birthdays_to_json
from backend.tests_utils import WeakAuthenticationBaseTestCase

ALL_USERS = ["17simple", "18simple", "17admin"]
"""A list of user ids covering all the spectrum of roles and permissions."""


class BaseWidgetsTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_widgets.yaml", "test_birthdays.json"]

    def endpoint_list_widgets(self):
        return f"/subscriptions/"

    def list_widgets(self):
        return self.get(self.endpoint_list_widgets())

    def endpoint_balance(self):
        return f"/subscriptions/balance/"

    def balance_widget(self):
        return self.get(self.endpoint_balance())

    def endpoint_birthday(self):
        return f"/subscriptions/birthday/"

    def birthday_widget(self):
        return self.get(self.endpoint_birthday())

    def endpoint_library(self, library_id):
        return f"/subscriptions/library/{library_id}/"

    def endpoint_library_bd_tek(self):
        return self.endpoint_library("bd-tek")

    def library_widget(self, library_id):
        return self.get(self.endpoint_library(library_id))

    def library_bd_tek_widget(self):
        return self.library_widget("bd-tek")

    def endpoint_marketplace(self, marketplace_id):
        return f"/subscriptions/marketplace/{marketplace_id}/"

    def endpoint_marketplace_pdm(self):
        return self.endpoint_marketplace("pdm")

    def marketplace_widget(self, marketplace_id):
        return self.get(self.endpoint_marketplace(marketplace_id))

    def marketplace_pdm_widget(self):
        return self.marketplace_widget("pdm")

    def endpoint_poll(self):
        return f"/subscriptions/poll/"

    def poll_widget(self, data=None):
        return self.get(self.endpoint_poll(), data)

    def endpoint_repartition(self):
        return f"/subscriptions/repartition/"

    def repartition_widget(self):
        return self.get(self.endpoint_repartition())

    def endpoint_timeline(self):
        return f"/subscriptions/timeline/"

    def timeline_widget(self):
        return self.get(self.endpoint_timeline())

    def endpoint_vote(self):
        return f"/subscriptions/vote/"

    def vote_widget(self):
        return self.get(self.endpoint_vote())


class WidgetsTestCase(BaseWidgetsTestCase):
    widget_names = [
        "balance",
        "birthday",
        "library_bd_tek",
        "marketplace_pdm",
        "poll",
        "repartition",
        "timeline",
        "vote",
    ]

    def test_if_not_logged_in_then_401(self):
        res = self.list_widgets()
        self.assertStatusCode(res, 401)

        for widget_name in self.widget_names:
            res = getattr(self, f"{widget_name}_widget")()
            self.assertStatusCode(res, 401)

    def test_only_get_allowed(self):
        def loop_methods_over_endpoints(status_code=405):
            def loop_methods(endpoint, status_code=405):
                res = self.post(endpoint)
                self.assertStatusCode(res, status_code)
                res = self.patch(endpoint)
                self.assertStatusCode(res, status_code)
                res = self.delete(endpoint)
                self.assertStatusCode(res, status_code)
                res = self.put(endpoint)
                self.assertStatusCode(res, status_code)

            for widget_name in self.widget_names:
                loop_methods(getattr(self, f"endpoint_{widget_name}")(), status_code)

            loop_methods(self.endpoint_list_widgets(), status_code)

        # First try logged out.
        loop_methods_over_endpoints(401)

        for user in ALL_USERS:
            self.login(user)
            loop_methods_over_endpoints(405)

    def test_list_widgets(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.list_widgets()
            self.assertStatusCode(res, 200)

            self.assertSetEqual({"widgets"}, set(res.data.keys()))
            self.assertEqual(len(res.data["widgets"]), 10)

            for widget in res.data["widgets"]:
                self.assertSetEqual({"type", "mandatory", "url"}, set(widget.keys()))

                if widget["type"] in (
                    "timeline",
                    "birthday",
                    "poll",
                    "vote",
                    "repartition",
                    "balance",
                ):
                    self.assertTrue(widget["mandatory"], msg=widget)
                else:
                    self.assertFalse(widget["mandatory"], msg=widget)

    def test_balance_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.balance_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(
                res.data["balances"],
                [
                    {
                        "balance": compute_balance(user, marketplace.id),
                        "marketplace": marketplace.id,
                        "user": user,
                    }
                    for marketplace in Marketplace.objects.filter(enabled=True).all()
                ],
            )

    def test_birthday_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.birthday_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(res.data, birthdays_to_json(7))

    def test_library_widget(self):
        self.login("17simple")
        res = self.library_widget("bd-tek")
        self.assertStatusCode(res, 200)

        self.assertTrue("suggested_loanables" in res.data)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(len(res.data["suggested_loanables"]), 2)

    def test_marketplace_widget(self):
        self.login("17simple")
        res = self.marketplace_widget("pdm")
        self.assertStatusCode(res, 200)

        self.assertTrue("suggested_products" in res.data and "balance" in res.data)
        self.assertEqual(len(res.data), 2)
        self.assertEqual(len(res.data["suggested_products"]), 2)

    def test_poll_widget(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.poll_widget()
            self.assertStatusCode(res, 200)
            self.assertEqual(res.data["polls"], [])

            res = self.poll_widget({"date": "2019-08-01"})
            self.assertStatusCode(res, 200)
            self.assertEqual(
                list(map(lambda poll: poll["id"], res.data["polls"])), [1, 4]
            )

    def test_repartition_widget(self):
        # TODO once repartition widget is written.
        pass

    def test_timeline_widget(self):
        # TODO rewrite
        pass

    def test_vote_widget(self):
        self.login("17simple")
        res = self.vote_widget()
        self.assertStatusCode(res, 200)

        self.assertTrue("elections" in res.data)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(len(res.data["elections"]), 1)
