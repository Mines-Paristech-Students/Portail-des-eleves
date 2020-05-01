from courses.models import Form, Question, Rating
from courses.serializers import FormSerializer

from django.urls import reverse

from backend.tests_utils import WeakAuthenticationBaseTestCase


class SubmitTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_submission.yaml"]

    ALL_USERS = ["17simple"]

    def submit(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_submit(), data, format)

    def endpoint_submit(self):
        return "/courses/submit"

    submission_data = {
        "course": 1,
        "ratings": [
            {
                "id": 1,
                "value": 2,
            }
        ],
        "comments": [
            {
                "id": 2,
                "content": "plop",
            }
        ]
    }

    # 1 Question necessary
    # 2 rating optionnal
    # 3 question optionnal
    # 4 rating archived

    ########
    # AUTH #
    ########

    def test_if_not_logged_in_then_cannot_submit(self):
        res = self.submit()
        self.assertStatusCode(res, 401)

    def test_if_logged_in_cannot_submit_twice(self):
        self.login("17simple")
        res = self.submit(data=self.submission_data)
        self.assertStatusCode(res, 405)
        self.assertFalse(Rating.objects.all().exists())
    
    def test_if_logged_in_can_submit_once(self):
        pass

    # def test_if_logged_in_then_cannot_submit_without_required_questions(self):
    #     self.login("17simple")
    #     data = copy.deepcopy(self.submit_course_data).pop("ratings")

    #     res = self.submit(pk=self.submit_course_data["id"], data=data)
    #     self.assertStatusCode(res, 404)
    # Format has to be json ?

    ################
    # MISSING DATA #
    ################

    # Test missing data
