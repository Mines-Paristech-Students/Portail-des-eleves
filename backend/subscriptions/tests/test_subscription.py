from backend.tests_utils import WeakAuthenticationBaseTestCase
from subscriptions.models import WidgetSubscription

ALL_USERS = ["17simple", "18simple", "17admin"]
"""A list of user ids covering all the spectrum of roles and permissions."""


class BaseSubscriptionTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml"]

    def endpoint_set(self):
        return f"/subscriptions/subscriptions/set/"

    def endpoint_get(self):
        return f"/subscriptions/subscriptions/get/"

    def test_get_set_work(self):
        self.login("17bocquet")

        # create
        res = self.post(self.endpoint_set(), {"payload": "this is some pref text"})
        self.assertEqual(res.status_code, 201)

        res = self.get(self.endpoint_get())
        self.assertEqual(res.status_code, 200)
        self.assertEqual(
            res.data, {"user": "17bocquet", "payload": "this is some pref text"}
        )

        # update
        res = self.post(self.endpoint_set(), {"payload": "AN UPDATE !"})
        self.assertEqual(res.status_code, 200)

        res = self.get(self.endpoint_get())
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data, {"user": "17bocquet", "payload": "AN UPDATE !"})

    def test_cannot_set_other_pref_for_other_account(self):
        self.login("17bocquet")

        res = self.post(
            self.endpoint_set(),
            {"payload": "this is some pref text", "user": "19simple"},
        )
        self.assertEqual(res.status_code, 201)

        self.assertEqual(WidgetSubscription.objects.filter(user="19simple").count(), 0)

    def test_common_uris_dont_exist(self):
        self.assertEqual(self.get("/subscriptions/subscriptions/").status_code, 401)
        self.assertEqual(
            self.post("/subscriptions/subscriptions/", {}).status_code, 401
        )
        self.assertEqual(
            self.put("/subscriptions/subscriptions/1/", {}).status_code, 401
        )
        self.assertEqual(
            self.delete("/subscriptions/subscriptions/1/").status_code, 401
        )
