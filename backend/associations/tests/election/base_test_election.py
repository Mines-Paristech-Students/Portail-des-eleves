from backend.tests_utils import WeakAuthenticationBaseTestCase

# Please see the comments on test_election.yaml to get a better understanding of the test fixtures.

ALL_USERS = [
    "17simple",
    "17admin",
    "17admin_biero",
    "17member_biero",
    "17election_biero",
    "17admin_pdm",
    "17member_pdm",
    "17election_pdm",
]
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_ELECTION_BIERO = [
    user for user in ALL_USERS if user != "17election_biero"
]
"""Same as ALL_USERS, but with 17election_biero removed."""

ALL_USERS_EXCEPT_ELECTION_PDM = [user for user in ALL_USERS if user != "17election_pdm"]
"""Same as ALL_USERS, but with 17election_pdm removed."""

ALL_USERS_EXCEPT_ELECTION_ADMIN = [user for user in ALL_USERS if "election" not in user]
"""Same as ALL_USERS, but with 17election* removed."""

ALL_USERS_EXCEPT_ADMIN = [user for user in ALL_USERS if "admin" not in user]
"""Same as ALL_USERS, but with all the association administrators removed."""


class BaseElectionTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_election.yaml"]
