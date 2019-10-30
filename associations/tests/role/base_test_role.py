from associations.models import Role
from backend.tests_utils import BaseTestCase

# Please see the comments on test_role.yaml to get a better understanding of the test fixtures.

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

ALL_USERS_EXCEPT_ADMIN_BIERO = [user for user in ALL_USERS if user != "17admin_biero"]


class BaseRoleTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_role.yaml"]

    def endpoint_list(self):
        """Return the endpoint associated to the list action."""
        return f"/associations/roles/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        """Return the endpoint associated to the retrieve action."""
        return f"/associations/roles/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        """Return the endpoint associated to the create action."""
        return f"/associations/roles/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format, content_type)

    def endpoint_update(self, pk):
        """Return the endpoint associated to the update action."""
        return f"/associations/roles/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_destroy(self, pk):
        """Return the endpoint associated to the destroy action."""
        return f"/associations/roles/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)

    SERIALIZED_FIELDS = (
        ("id", "user", "association", "role", "rank", "is_archived")
        + Role.PERMISSION_NAMES
        + tuple(
            f"{permission_name}_permission" for permission_name in Role.PERMISSION_NAMES
        )
    )
    GLOBAL_ADMIN_ALLOWED_FIELDS = ("user", "association", "administration_permission")
    ASSOCIATION_ADMIN_ALLOWED_FIELDS = (
        "user",
        "association",
        "is_archived",
        "role",
        "rank",
    ) + tuple(
        f"{permission_name}_permission" for permission_name in Role.PERMISSION_NAMES
    )

    global_admin_create_role_data = {
        "user": "17admin_pdm",
        "association": "biero",
        "administration_permission": True,
    }

    global_admin_create_role_invalid_data = {
        "user": "17admin_pdm",
        "association": "biero",
        "administration_permission": True,
        "is_archived": True,
        "role": "Nouveau dictateur",
        "rank": 5,
        "election_permission": True,
        "event_permission": True,
        "media_permission": True,
        "library_permission": True,
        "marketplace_permission": True,
        "page_permission": True,
    }

    association_admin_create_role_data = {
        "user": "17admin_pdm",
        "association": "biero",
        "administration_permission": True,
        "is_archived": True,
        "role": "Nouveau dictateur",
        "rank": 5,
        "election_permission": True,
        "event_permission": True,
        "media_permission": True,
        "library_permission": True,
        "marketplace_permission": True,
        "page_permission": True,
    }

    association_admin_create_role_invalid_data = {
        "user": "17admin_pdm",
        "association": "biero",
        "administration_permission": True,
        "is_archived": True,
        "role": "Nouveau dictateur",
        "rank": 5,
        "election": True,
        "event": True,
        "media": True,
        "library": True,
        "marketplace": True,
        "page": True,
    }

    association_admin_create_role_for_pdm = {
        "user": "17admin_biero",
        "association": "pdm",
        "administration_permission": True,
        "role": "Nouveau dictateur",
    }
