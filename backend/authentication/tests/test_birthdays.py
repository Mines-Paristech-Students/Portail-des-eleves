import json
from datetime import datetime, timedelta

from authentication.models import User
from backend.tests_utils import WeakAuthenticationBaseTestCase


class BirthdaysTestCase(WeakAuthenticationBaseTestCase):
    """Test the birthdays endpoint logic."""

    fixtures = ("test_authentication.yaml",)

    def load_birthdays(self):
        date = datetime(1996, 1, 1, 12, 00, 00)
        one_day = timedelta(1)

        for i in range(1827):
            User.objects.create(
                pk=f"user{i}",
                birthday=date,
                city_of_origin="",
                email=f"user{i}@mines-paristech.fr",
                first_name=f"User{i}",
                is_active=True,
                is_staff=True,
                last_login=None,
                last_name="User{i}",
                nickname="",
                password="pbkdf2_sha256$100000$tos6gO0V3tNL$Vd14vNq3N5MwGX6TsvBV0RW+DQzGpy3OGfKqCtL3kls=",
                phone="",
                year_of_entry=2016 + i % 4,
                room="",
            )
            date += one_day

    def test_if_not_logged_in_then_401(self):
        res = self.get("/users/birthdays/2/")
        self.assertStatusCode(res, 401)

    def test_birthdays(self):
        self.load_birthdays()
        self.login("17simple")

        number_of_days = 20
        res = self.get(f"/users/birthdays/{number_of_days}/")
        self.assertStatusCode(res, 200)

        birthdays = json.loads(res.content)["birthdays"]
        self.assertEqual(len(birthdays), number_of_days)

        self.assertListEqual(
            [len(birthdays[i]["users"]) for i in range(number_of_days)],
            [5] * number_of_days,
        )

        self.assertTrue(
            all(
                (birthdays[i]["month"], birthdays[i]["day"])
                < (birthdays[i + 1]["month"], birthdays[i + 1]["day"])
                for i in range(number_of_days - 1)
            ),
            "Birthdays are not sorted correctly",
        )
