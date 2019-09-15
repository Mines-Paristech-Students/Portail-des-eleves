from associations.tests.base_test import BaseTestCase

# Please see the comments on test_marketplace.yaml to get a better understanding of the test fixtures.

ALL_USERS = ['17simple', '17member_biero', '17market_biero', '17admin_biero', '17market_pdm', '17admin']
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_MARKET_BIERO = [user for user in ALL_USERS if user != '17market_biero']
"""Same as ALL_USERS, but without 17market_biero."""

ALL_USERS_EXCEPT_MARKET_PDM = [user for user in ALL_USERS if user != '17market_pdm']
"""Same as ALL_USERS, but without 17market_pdm."""

ALL_USERS_EXCEPT_ADMIN_BIERO = [user for user in ALL_USERS if user != '17admin_biero']
"""Same as ALL_USERS, but without 17admin_biero."""

ALL_USERS_EXCEPT_MARKET_ADMIN = [user for user in ALL_USERS if 'market' not in user]
"""Same as ALL_USERS, but without all the market administrators."""


class BaseMarketPlaceTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_marketplace.yaml']
