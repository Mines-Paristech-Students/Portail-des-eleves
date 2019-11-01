from backend.tests_utils import WeakAuthenticationBaseTestCase

ALL_USERS = ["17simple", "18simple", "17admin"]
"""A list of user ids covering all the spectrum of roles and permissions."""


class BaseSubscriptionTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_subscriptions.yaml"]

    def endpoint_list(self):
        return f"/subscriptions/subscriptions/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/subscriptions/subscriptions/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return f"/subscriptions/subscriptions/"

    def create(self, data=None, format="json"):
        return self.post(self.endpoint_create(), data, format)

    def endpoint_update(self, pk):
        return f"/subscriptions/subscriptions/{pk}/"

    def update(self, pk, data=None, format="json"):
        return self.patch(self.endpoint_update(pk), data, format)

    def endpoint_destroy(self, pk):
        return f"/subscriptions/subscriptions/{pk}/"

    def destroy(self, pk):
        return self.delete(self.endpoint_destroy(pk))
