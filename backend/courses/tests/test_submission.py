import copy

from courses.models import Form, Question, Rating, Course, Comment
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
                "question": 1,
                "value": 2,
            }
        ],
        "comments": [
            {
                "question": 3,
                "content": "plop",
            }
        ]
    }

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
        self.login('17bocquet')
        res = self.submit(data=self.submission_data)
        self.assertStatusCode(res, 201)

        self.assertTrue(
            Course.objects.filter(have_voted='17bocquet').exists(),
            True,
        )

        new_rating = Rating.objects.latest('date')
        data_rating = self.submission_data["ratings"][0]
        self.assertEqual(new_rating.value, data_rating["value"])
        self.assertEqual(new_rating.question.id, data_rating["question"])
        self.assertEqual(new_rating.course.id, self.submission_data["course"])

        new_comment = Comment.objects.latest('date')
        data_comment = self.submission_data["comments"][0]
        self.assertEqual(new_comment.content, data_comment["content"])
        self.assertEqual(new_comment.question.id, data_comment["question"])
        self.assertEqual(new_comment.course.id, self.submission_data["course"])

    ######################
    # MISSING & BAD-DATA #
    ######################

    # WRONG CATEGORY #

    def test_if_logged_in_cannot_submit_wrong_category_ratings(self):
        self.login("17bocquet")

        fake_data = copy.deepcopy(self.submission_data)
        fake_data["ratings"].append({
            "question": 4,
            "value": "plip",
        })

        res = self.submit(data=fake_data)
        self.assertStatusCode(res, 400)

    def test_if_logged_in_cannot_submit_wrong_category_comments(self):
        self.login("17bocquet")

        fake_data = copy.deepcopy(self.submission_data)
        fake_data["comments"].append({
            "question": 2,
            "content": "plip",
        })

        res = self.submit(data=fake_data)
        self.assertStatusCode(res, 400)

    # ARCHIVED QUESTIONS #

    def test_if_logged_in_cannot_submit_if_archived_questions(self):
        self.login("17bocquet")

        fake_data = copy.deepcopy(self.submission_data)
        fake_data["ratings"].append({
            "question": 5,
            "value": 3,
        })

        res = self.submit(data=fake_data)
        self.assertStatusCode(res, 400)
    
    # COURSE WITHOUT FORM #

    def test_if_logged_in_cannot_submit_if_course_has_no_form(self):
        self.login("17bocquet")

        res = self.submit(data={"course": 2})
        self.assertStatusCode(res, 400)

    # MISSING REQUIRED DATA #

    def test_if_logged_in_cannot_submit_if_missing_required(self):
        self.login("17bocquet")

        fake_data = copy.deepcopy(self.submission_data)
        fake_data.pop('ratings')

        res = self.submit(data=fake_data)
        self.assertStatusCode(res, 400)