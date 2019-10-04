from datetime import date, datetime, timezone

from backend.tests_utils import BaseTestCase
from forum.models import Poll


class PollTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_polls.yaml"]

    ALL_USERS = ["17admin", "17simple"]
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return "/polls/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/polls/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/polls/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format, content_type)

    def endpoint_update(self, pk):
        return f"/polls/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_destroy(self, pk):
        return f"/polls/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)

    def endpoint_vote(self, pk):
        return f"/polls/{pk}/vote/"

    def vote(self, pk, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_vote(pk), data, format, content_type)

    def endpoint_results(self, pk):
        return f"/polls/{pk}/results/"

    def results(self, pk, data="", format=None, content_type=None):
        return self.get(self.endpoint_results(pk), data)
