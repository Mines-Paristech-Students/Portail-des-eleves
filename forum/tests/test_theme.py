from django.core.exceptions import ObjectDoesNotExist

from backend.tests_utils import WeakAuthenticationBaseTestCase
from forum.models import Theme


class ThemeTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_forum.yaml"]

    ALL_USERS = ["17admin", "17simple"]
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return "/forum/themes/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/forum/themes/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/forum/themes/"

    def create(self, data=None, format="json"):
        return self.post(self.endpoint_create(), data, format)

    def endpoint_update(self, pk):
        return f"/forum/themes/{pk}/"

    def update(self, pk, data=None, format="json"):
        return self.patch(self.endpoint_update(pk), data, format)

    def endpoint_destroy(self, pk):
        return f"/forum/themes/{pk}/"

    def destroy(self, pk):
        return self.delete(self.endpoint_destroy(pk))

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_themes(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_themes(self):
        self.login("17simple")
        res = self.list()
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_theme(self):
        res = self.retrieve(pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_theme(self):
        self.login("17simple")
        res = self.retrieve(pk=1)
        self.assertStatusCode(res, 200)

    def test_if_theme_does_not_exist_then_404(self):
        self.login("17simple")
        res = self.retrieve(pk=42)
        self.assertFalse(Theme.objects.filter(pk="42").exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    create_theme_data = {
        "name": "Les cours",
        "description": "Viens dire à quel point t’as kiffé Maths 1.",
    }

    def test_if_not_global_admin_then_cannot_create_themes(self):
        self.login("17simple")
        res = self.create(data=self.create_theme_data)
        self.assertStatusCode(res, 403)
        self.assertRaises(
            ObjectDoesNotExist, Theme.objects.get, name=self.create_theme_data["name"]
        )

    def test_if_global_admin_then_can_create_themes(self):
        self.login("17admin")
        res = self.create(data=self.create_theme_data)
        self.assertStatusCode(res, 201)
        self.assertTrue(
            Theme.objects.filter(name=self.create_theme_data["name"]).exists()
        )

    ##########
    # UPDATE #
    ##########

    update_theme_data = {
        "name": "Les associations",
        "description": "Partage ton claquage.",
    }

    def test_if_not_global_admin_then_cannot_update_themes(self):
        self.login("17simple")

        theme_before = Theme.objects.get(pk=1)
        res = self.update(pk=1, data=self.update_theme_data)
        self.assertStatusCode(res, 403)
        self.assertEqual(theme_before, Theme.objects.get(pk=1))

    def test_if_global_admin_then_can_update_themes(self):
        self.login("17admin")
        res = self.update(pk=1, data=self.update_theme_data)
        self.assertStatusCode(res, 200)
        self.assertEqual(self.update_theme_data["name"], Theme.objects.get(pk=1).name)
        self.assertEqual(
            self.update_theme_data["description"], Theme.objects.get(pk=1).description
        )

    ###########
    # DESTROY #
    ###########

    def test_if_not_global_admin_then_cannot_destroy_themes(self):
        self.login("17simple")
        res = self.destroy(pk=1)
        self.assertStatusCode(res, 403)
        self.assertTrue(Theme.objects.filter(pk=1).exists())

    def test_if_global_admin_then_can_destroy_themes(self):
        self.login("17admin")
        res = self.destroy(pk=1)
        self.assertStatusCode(res, 204)
        self.assertFalse(Theme.objects.filter(pk=1).exists())
