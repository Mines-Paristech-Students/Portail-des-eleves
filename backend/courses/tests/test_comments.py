
from courses.models import Comment

from backend.tests_utils import WeakAuthenticationBaseTestCase


class CommentTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_comments.yaml"]

    EXPECTED_FIELDS = {
        "count",
        "next",
        "previous",
        "results",
    }

    ALL_USERS = ["17admin", "17simple"]

    def endpoint_list(self):
        return "/courses/comments/"

    def list(self, data=None, courseat="json", content_type="application/json"):
        return self.post(self.endpoint_list(), data, content_type)

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list(self):
        res = self.list()
        self.assertStatusCode(res, 404)

    def if_logged_in_then_can_list(self):
        self.login("17simple")
        res = self.list()
        self.assertStatusCode(res, 200)