import json

from authentication.models import User
from backend.tests_utils import WeakAuthenticationBaseTestCase


class PromotionsTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ("test_authentication.yaml", "test_birthdays.json")

    def test_if_not_logged_in_then_401(self):
        res = self.get("/users/promotions/")
        self.assertStatusCode(res, 401)

    def test_promotions(self):
        self.login("17simple")

        res = self.get("/users/promotions/")
        self.assertStatusCode(res, 200)

        promotions = json.loads(res.content)["promotions"]

        self.assertSetEqual(
            set(promotions),
            set(
                user.promotion
                for user in User.objects.all()
                if user.promotion is not None
            ),
        )
