from backend.tests_utils import BaseTestCase

# Please see the comments on test_association.yaml to get a better understanding of the test fixtures.

ALL_USERS = [
    "17simple",
    "17admin",
    "17admin_biero",
    "17member_biero",
    "17admin_pdm",
    "17member_pdm",
]
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_GLOBAL_ADMIN = [user for user in ALL_USERS if user != "17admin"]
"""Same as ALL_USERS, but with `17admin` removed."""

ALL_USERS_EXCEPT_ASSOCIATION_ADMIN = [
    user for user in ALL_USERS if "17admin_" not in user
]
"""Same as ALL_USERS, but with all the association administrators removed."""


class BaseAssociationTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_association.yaml"]

    def endpoint_list(self):
        """Return the endpoint associated to the list action."""
        return f"/associations/associations/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        """Return the endpoint associated to the retrieve action."""
        return f"/associations/associations/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        """Return the endpoint associated to the create action."""
        return f"/associations/associations/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format, content_type)

    def endpoint_update(self, pk):
        """Return the endpoint associated to the update action."""
        return f"/associations/associations/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_destroy(self, pk):
        """Return the endpoint associated to the destroy action."""
        return f"/associations/associations/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)
