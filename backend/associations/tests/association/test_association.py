from associations.models import Association
from associations.tests.association.base_test_association import (
    BaseAssociationTestCase,
    ALL_USERS_EXCEPT_GLOBAL_ADMIN,
)


class AssociationTestCase(BaseAssociationTestCase):
    EXPECTED_FIELDS = {
        "id",
        "name",
        "logo",
        "is_hidden",
        "rank",
        "my_role",
        "enabled_modules",
    }

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def if_logged_in_then_can_list(self):
        self.login("17simple")
        res = self.list()
        self.assertStatusCode(res, 200)
        for association in res.data:
            self.assertSetEqual(set(association.keys()), self.EXPECTED_FIELDS)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve(self):
        res = self.retrieve("biero")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve(self):
        self.login("17simple")
        res = self.retrieve("biero")
        self.assertStatusCode(res, 200)
        self.assertSetEqual(set(res.data), self.EXPECTED_FIELDS)

    ##########
    # CREATE #
    ##########

    create_association_data = {
        "name": "Bureau des Arts",
        "logo": None,
        "is_hidden": False,
        "rank": 0,
    }

    def test_if_not_global_admin_then_cannot_create(self):
        for user in ALL_USERS_EXCEPT_GLOBAL_ADMIN:
            self.login(user)
            res = self.create(self.create_association_data)
            self.assertStatusCode(res, 403)
            self.assertFalse(Association.objects.filter(pk="bureau-des-arts").exists())

    def test_if_global_admin_then_can_create(self):
        self.login("17admin")
        res = self.create(self.create_association_data)
        self.assertStatusCode(res, 201)

        self.assertTrue(Association.objects.filter(pk="bureau-des-arts").exists())
        association = Association.objects.get(pk="bureau-des-arts")
        self.assertEqual(association.name, self.create_association_data["name"])
        self.assertFalse(association.logo)
        self.assertEqual(
            association.is_hidden, self.create_association_data["is_hidden"]
        )
        self.assertEqual(association.rank, self.create_association_data["rank"])

    ##########
    # UPDATE #
    ##########
    update_association_data = {
        "name": "Bureau des Sports",
        "logo": None,
        "is_hidden": True,
        "rank": 42,
    }

    def test_if_not_global_admin_then_cannot_update(self):
        for user in ALL_USERS_EXCEPT_GLOBAL_ADMIN:
            self.login(user)
            res = self.update("pdm", self.update_association_data)
            self.assertStatusCode(res, 403)
            self.assertTrue(Association.objects.filter(pk="pdm").exists())

    def test_if_global_admin_then_can_update(self):
        self.login("17admin")
        res = self.update("pdm", self.update_association_data)
        self.assertStatusCode(res, 200)

        self.assertTrue(Association.objects.filter(pk="pdm").exists())
        association = Association.objects.get(pk="pdm")
        self.assertEqual(association.name, self.update_association_data["name"])
        self.assertFalse(association.logo)
        self.assertEqual(
            association.is_hidden, self.update_association_data["is_hidden"]
        )
        self.assertEqual(association.rank, self.update_association_data["rank"])

    ###########
    # DESTROY #
    ###########

    def test_if_not_global_admin_then_cannot_destroy(self):
        for user in ALL_USERS_EXCEPT_GLOBAL_ADMIN:
            self.login(user)
            res = self.destroy("pdm")
            self.assertStatusCode(res, 403)
            self.assertTrue(Association.objects.filter(pk="pdm").exists())

    def test_if_global_admin_then_can_destroy(self):
        self.login("17admin")
        res = self.destroy("pdm")
        self.assertStatusCode(res, 204)
        self.assertFalse(Association.objects.filter(pk="pdm").exists())
