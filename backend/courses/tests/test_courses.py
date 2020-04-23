from courses.models import Course
from courses.serializers import CourseSerializer

from backend.tests_utils import WeakAuthenticationBaseTestCase



class AssociationTestCase(WeakAuthenticationBaseTestCase):
    EXPECTED_FIELDS = {
        "id",
        "name",
        "form",
        "has_voted",
    }

    ALL_USERS = ["17admin", "17simple"]
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return "/users/profile_question/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/users/profile_question/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/users/profile_question/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format)

    def endpoint_update(self, pk):
        return f"/users/profile_question/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format)

    def endpoint_destroy(self, pk):
        return f"/users/profile_question/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk))

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
        "id": "bda",
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
            self.assertFalse(
                Association.objects.filter(
                    pk=self.create_association_data["id"]
                ).exists()
            )

    def test_if_global_admin_then_can_create(self):
        self.login("17admin")
        res = self.create(self.create_association_data)
        self.assertStatusCode(res, 201)

        self.assertTrue(
            Association.objects.filter(pk=self.create_association_data["id"]).exists()
        )
        association = Association.objects.get(pk=self.create_association_data["id"])
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
        "id": "bds",
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

        self.assertTrue(
            Association.objects.filter(pk=self.update_association_data["id"]).exists()
        )
        association = Association.objects.get(pk=self.update_association_data["id"])
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