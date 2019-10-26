from associations.tests.base_test import BaseTestCase

# Please see the comments on test_library.yaml to get a better understanding of the test fixtures.
# TODO: test which fields are serialized.

ALL_USERS = [
    "17simple",
    "17member_bd-tek",
    "17library_bd-tek",
    "17admin_bd-tek",
    "17library_biero",
    "17admin",
]
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_LIBRARY_BD_TEK = [
    user for user in ALL_USERS if user != "17library_bd-tek"
]
"""Same as ALL_USERS, but with 17library_bd-tek removed."""

ALL_USERS_EXCEPT_LIBRARY_BIERO = [
    user for user in ALL_USERS if user != "17library_biero"
]
"""Same as ALL_USERS, but with 17library_biero removed."""

ALL_USERS_EXCEPT_ADMIN_BD_TEK = [user for user in ALL_USERS if user != "17admin_bd-tek"]
"""Same as ALL_USERS, but with 17admin_bd-tek removed."""

ALL_USERS_EXCEPT_LIBRARY_ADMIN = [user for user in ALL_USERS if "library" not in user]
"""Same as ALL_USERS, but with all the library administrators removed."""


class BaseLibraryTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_library.yaml"]
