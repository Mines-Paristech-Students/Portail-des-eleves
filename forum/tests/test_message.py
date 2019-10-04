from datetime import date, datetime, timezone

from backend.tests_utils import BaseTestCase
from forum.models import Theme


class ThemeTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_forum.yaml"]

    ALL_USERS = ["17admin", "17simple"]
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return "/themes/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/themes/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/themes/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format, content_type)

    def endpoint_update(self, pk):
        return f"/themes/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_destroy(self, pk):
        return f"/themes/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)
