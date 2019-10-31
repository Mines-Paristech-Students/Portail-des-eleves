from backend.tests_utils import WeakAuthenticationBaseTestCase

from authentication.models.questions import ProfileQuestion


class TestProfileQuestion(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_questions.yaml"]

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

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve(self):
        res = self.retrieve(1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve(self):
        for user in self.ALL_USERS:
            self.login(user)
            res = self.retrieve(1)
            self.assertStatusCode(res, 200)

            self.assertSetEqual({"id", "text"}, set(res.data.keys()))

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_list(self):
        for user in self.ALL_USERS:
            self.login(user)
            res = self.list()
            self.assertStatusCode(res, 200)

            self.assertSetEqual(
                set(q.id for q in ProfileQuestion.objects.all()),
                set(q["id"] for q in res.data),
            )

    ##########
    # CREATE #
    ##########

    profile_question_create_data = {"text": "Aimes-tu les salsifis ?"}

    def test_if_not_global_admin_then_cannot_create(self):
        self.login("17simple")

        length_before = len(ProfileQuestion.objects.all())
        res = self.create(data=self.profile_question_create_data)
        self.assertStatusCode(res, 403)
        self.assertEqual(length_before, len(ProfileQuestion.objects.all()))

    def test_if_global_admin_then_can_create(self):
        self.login("17admin")

        length_before = len(ProfileQuestion.objects.all())
        res = self.create(data=self.profile_question_create_data)
        self.assertStatusCode(res, 201)
        self.assertEqual(length_before + 1, len(ProfileQuestion.objects.all()))
        self.assertEqual(
            ProfileQuestion.objects.last().text,
            self.profile_question_create_data["text"],
        )

    ##########
    # UPDATE #
    ##########

    profile_question_update_data = {"text": "Aimes-tu les salsifis ?"}

    def test_if_not_global_admin_then_cannot_update(self):
        self.login("17simple")

        profile_question_before = ProfileQuestion.objects.get(pk=1)
        res = self.update(pk=1, data=self.profile_question_create_data)
        self.assertStatusCode(res, 403)
        self.assertEqual(
            profile_question_before.text, ProfileQuestion.objects.get(pk=1).text
        )

    def test_if_global_admin_then_can_update(self):
        self.login("17admin")

        res = self.update(pk=1, data=self.profile_question_create_data)
        self.assertStatusCode(res, 200)
        self.assertEqual(
            self.profile_question_update_data["text"],
            ProfileQuestion.objects.get(pk=1).text,
        )

    ##########
    # DELETE #
    ##########

    def test_if_not_global_admin_then_cannot_delete(self):
        self.login("17simple")

        length_before = len(ProfileQuestion.objects.all())
        res = self.destroy(1)
        self.assertStatusCode(res, 403)
        self.assertEqual(length_before, len(ProfileQuestion.objects.all()))

    def test_if_global_admin_then_can_delete(self):
        self.login("17admin")

        length_before = len(ProfileQuestion.objects.all())
        res = self.destroy(1)
        self.assertStatusCode(res, 204)
        self.assertEqual(length_before - 1, len(ProfileQuestion.objects.all()))
