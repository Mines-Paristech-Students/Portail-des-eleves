from authentication.models import User
from authentication.serializers.user import ReadOnlyUserSerializer
from rest_framework.renderers import JSONRenderer

from backend.tests_utils import WeakAuthenticationBaseTestCase


class ProfileTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml"]

    def assertContentIsEqualToUser(self, res, user):
        self.assertEqual(
            res.content, JSONRenderer().render(ReadOnlyUserSerializer(user).data)
        )

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_user(self):
        res = self.get("/users/users/17bocquet/")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_user(self):
        self.login("17simple")
        res = self.get("/users/users/17bocquet/")
        self.assertStatusCode(res, 200)
        self.assertContentIsEqualToUser(res, User.objects.get(pk="17bocquet"))

    def test_if_logged_in_then_can_retrieve_current_user(self):
        self.login("17simple")
        res = self.get("/users/users/current/")
        self.assertStatusCode(res, 200)
        self.assertContentIsEqualToUser(res, User.objects.get(pk="17simple"))

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list_user(self):
        res = self.get("/users/users/")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_list_user(self):
        self.login("17simple")
        res = self.get("/users/users/")
        self.assertStatusCode(res, 200)

    ##########
    # CREATE #
    ##########

    new_user_data = {
        "id": "17test",
        "first_name": "Test",
        "last_name": "Test",
        "email": "test@mpt.fr",
        "is_admin": "false",
        "year_of_entry": 2017,
    }

    def test_cannot_create_user_if_not_authorized(self):
        res = self.post("/users/users/", self.new_user_data)
        self.assertStatusCode(res, 401)

    def test_cannot_create_user_if_not_admin(self):
        self.login("17simple")
        res = self.post("/users/users/", self.new_user_data)
        self.assertStatusCode(res, 403)

    def test_can_create_user_if_admin(self):
        self.login("17admin")
        res = self.post("/users/users/", self.new_user_data)
        self.assertStatusCode(res, 201)

    ##########
    # UPDATE #
    ##########

    allowed_edits = {
        "nickname": "Nick",
        "phone": "123456",
        "room": "123",
        "city_of_origin": "Paris",
        "option": "Mécatro",
        "roommate": ["17bocquet"],
        "minesparent": ["17wan-fat"],
        "astcousin": ["17bocquet"],
    }

    not_allowed_edits = {
        "first_name": "New",
        "last_name": "Name",
        "birthday": "1942-01-02",
        "email": "new.email@mpt.fr",
        "year_of_entry": 2014,
        "student_type": "IC",
        "is_active": True,
        "is_admin": False,
    }

    def test_if_not_admin_then_can_edit_own_profile_with_allowed_edits(self):
        self.login("17simple")
        res = self.patch("/users/users/17simple/", data=self.allowed_edits)
        self.assertStatusCode(res, 200)

        user = User.objects.get(pk="17simple")
        for field in self.allowed_edits:
            if field in ["roommate", "minesparent", "astcousin"]:
                self.assertEqual(
                    [u.id for u in getattr(user, field).all()],
                    self.allowed_edits[field],
                )
            else:
                self.assertEqual(getattr(user, field), self.allowed_edits[field])

    def test_if_not_admin_then_cannot_edit_own_profile_with_disallowed_edits(self):
        self.login("17simple")

        for field, content in self.not_allowed_edits.items():
            user_before = User.objects.get(pk="17simple")
            res = self.patch("/users/users/17simple/", data={field: content})
            self.assertStatusCode(res, 200)
            user_after = User.objects.get(pk="17simple")
            self.assertEqual(getattr(user_before, field), getattr(user_after, field))

    def test_if_not_admin_then_cannot_edit_other_user_profile(self):
        self.login("17simple")
        res = self.patch("/users/users/17bocquet/", data=self.allowed_edits)
        self.assertStatusCode(res, 403)

    def test_if_admin_then_can_edit_other_user_profile_with_allowed_edits(self):
        self.login("17admin")
        res = self.patch("/users/users/17simple/", data=self.allowed_edits)
        self.assertStatusCode(res, 200)

        user = User.objects.get(pk="17simple")
        for field in self.allowed_edits:
            if field in ("roommate", "minesparent", "astcousin"):
                self.assertEqual(
                    [u.id for u in getattr(user, field).all()],
                    self.allowed_edits[field],
                )
            else:
                self.assertEqual(getattr(user, field), self.allowed_edits[field])

    def test_if_admin_then_cannot_edit_other_user_profile_with_disallowed_edits(self):
        self.login("17admin")

        for field, content in self.not_allowed_edits.items():
            user_before = User.objects.get(pk="17simple")
            res = self.patch("/users/users/17simple/", data={field: content})
            self.assertStatusCode(res, 200)
            user_after = User.objects.get(pk="17simple")
            self.assertEqual(getattr(user_before, field), getattr(user_after, field))

    ##########
    # DELETE #
    ##########

    def test_cannot_delete_user(self):
        self.login("17simple")
        res = self.delete("/users/users/17simple/")
        self.assertStatusCode(res, 403)
        self.assertTrue(User.objects.filter(pk="17simple").exists())

        self.login("17admin")
        res = self.delete("/users/users/17simple/")
        self.assertStatusCode(res, 403)
        self.assertTrue(User.objects.filter(pk="17simple").exists())
