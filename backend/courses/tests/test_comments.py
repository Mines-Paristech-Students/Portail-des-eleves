from django.http import QueryDict

from courses.models import Comment

from backend.tests_utils import WeakAuthenticationBaseTestCase


class CommentTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_comments.yaml"]

    EXPECTED_FIELDS = ["count", "next", "previous", "results"]

    EXPECTED_FIELDS_COMMENT = ["id", "question", "course", "content", "date"]

    ALL_USERS = ["17admin", "17simple"]

    def endpoint_list(self):
        return "/courses/comments/"

    def list(self, query_string=None):
        return self.get(
            self.endpoint_list() + ("?" + query_string if query_string else "")
        )

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list_comments(self):
        res = self.list()
        self.assertStatusCode(res, 404)

    ###########
    # OPTIONS #
    ###########

    # All these should return 1 results as in test_comments.yaml

    filter_date = "2100-04-20T22:10:57.577Z"
    filter_question = 1
    filter_course = 1
    filter_many = {"question": 2, "course": 1, "date": "2100-04-20T22:10:57.577Z"}

    def if_logged_in_then_can_list_all_comments(self):
        self.login("17simple")
        res = self.list()
        self.assertStatusCode(res, 200)

        # Pagination default is 5
        self.assertEqual(len(res.data), 5)

        for key in self.EXPECTED_FIELDS:
            self.assertIsNotNone(res.data[key])

        # Because of the ordering, we should get the most recent first
        last_comment = res.data["results"][0]

        for key in self.EXPECTED_FIELDS_COMMENT:
            self.assertIsNotNone(last_comment[key])

        self.assertEqual(last_comment["content"], "e")

    def if_logged_in_then_can_list_comments_by_question(self):
        self.login("17simple")
        res = self.list(query_string=f"?question={self.filter_question}")

        self.assertStatusCode(res, 200)
        self.assertEqual(len(res.data), 1)

    def if_logged_in_then_can_list_comments_by_date(self):
        self.login("17simple")
        res = self.list(query_string=f"?date={self.filter_date}")

        self.assertStatusCode(res, 200)
        self.assertEqual(len(res.data), 1)

    def if_logged_in_then_can_list_comments_by_course(self):
        self.login("17simple")
        res = self.list(query_string=f"?course={self.filter_course}")

        self.assertStatusCode(res, 200)
        self.assertEqual(len(res.data), 4)

    def if_logged_in_then_can_list_comments_by_many_filters(self):
        self.login("17simple")

        q = QueryDict(mutable=True)
        for key, value in self.filter_many:
            q[key] = value

        res = self.list(query_string=q.urlencode())

        self.assertStatusCode(res, 200)
        self.assertEqual(len(res.data), 1)
