import json

from backend.tests_utils import BaseTestCase


class BirthdaysTestCase(BaseTestCase):
    """Test the birthdays endpoint logic."""

    fixtures = ("birthdays_test.json",)

    def test_if_not_logged_in_then_401(self):
        res = self.get("/users/birthdays/2/")
        self.assertStatusCode(res, 401)

    def test_birthdays(self):
        self.create_and_login_user("17simple")

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
