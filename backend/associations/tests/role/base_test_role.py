from datetime import date

from associations.models import Role
from backend.tests_utils import WeakAuthenticationBaseTestCase

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


class BaseRoleTestCase(WeakAuthenticationBaseTestCase):
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

    def create(self, data=None, format="json"):
        return self.post(self.endpoint_create(), data, format)

    def endpoint_update(self, pk):
        """Return the endpoint associated to the update action."""
        return f"/associations/roles/{pk}/"

    def update(self, pk, data=None, format="json"):
        return self.patch(self.endpoint_update(pk), data, format)

    def endpoint_destroy(self, pk):
        """Return the endpoint associated to the destroy action."""
        return f"/associations/roles/{pk}/"

    def destroy(self, pk):
        return self.delete(self.endpoint_destroy(pk))

    SERIALIZED_FIELDS = (
        "id",
        "user",
        "association",
        "role",
        "rank",
        "start_date",
        "permissions",
        "end_date",
    )
    GLOBAL_ADMIN_ALLOWED_FIELDS = ("user", "association", "permissions")
    ASSOCIATION_ADMIN_ALLOWED_FIELDS = (
        "user",
        "association",
        "role",
        "rank",
        "permissions",
    )

    global_admin_create_role_data = {
        "user": "17admin_pdm",
        "association": "biero",
        "permissions": ["administration"],
    }

    global_admin_create_role_invalid_data = {
        "user": "17admin_pdm",
        "association": "biero",
        "role": "Nouveau dictateur",
        "start_date": date(2019, 1, 1),
        "end_date": date(2020, 1, 1),
        "rank": 5,
        "permissions": [
            "administration",
            "election",
            "event",
            "media",
            "library",
            "marketplace",
            "page",
        ],
    }

    association_admin_create_role_data = {
        "user": "17admin_pdm",
        "association": "biero",
        "role": "Nouveau dictateur",
        "start_date": date(2019, 1, 1),
        "end_date": date(2090, 1, 1),
        "rank": 5,
        "permissions": [
            "administration",
            "election",
            "event",
            "media",
            "library",
            "marketplace",
            "page",
        ],
    }

    association_admin_create_role_invalid_data = {
        "user": "17admin_pdm",
        "association": "biero",
        "is_active": False,
        "role": "Nouveau dictateur",
        "rank": 5,
        "permissions": [
            "administration",
            "election",
            "event",
            "media",
            "library",
            "marketplace",
            "page",
        ],
    }

    association_admin_create_role_for_pdm = {
        "user": "17admin_biero",
        "association": "pdm",
        "role": "Nouveau dictateur",
        "permissions": ["administration"],
    }
