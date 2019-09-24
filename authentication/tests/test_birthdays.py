import json

from backend.tests_utils import BackendTestCase


class BirthdaysTestCase(BackendTestCase):
    """Test the birthdays endpoint logic."""

    fixtures = ('birthdays_test.json',)

    def test_birthdays(self):
        self.create_and_login_user('17simple')

        number_of_days = 20
        res = self.get(f'birthdays/{number_of_days}/')
        self.assertStatusCode(res, 200)

        birthdays = json.loads(res.content)['birthdays']

        self.assertEqual(len(birthdays), number_of_days)

        self.assertListEqual(
            [len(birthdays[i]['users']) for i in range(number_of_days)],
            [5] * number_of_days,
        )

        self.assertTrue(
            all(
                (birthdays[i]['month'], birthdays[i]['day']) < (birthdays[i + 1]['month'], birthdays[i + 1]['day'])
                for i in range(number_of_days - 1)
            ),
            "Birthdays are not sorted correctly"
        )
