from backend.tests_utils import BaseTestCase

from authentication.models.questions import ProfileAnswer


class TestProfileAnswer(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_questions.yaml"]

    ALL_USERS = ["17admin", "17simple"]
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return "/profile_answer/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/profile_answer/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/profile_answer/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format, content_type)

    def endpoint_update(self, pk):
        return f"/profile_answer/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_destroy(self, pk):
        return f"/profile_answer/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)

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

            self.assertSetEqual(
                {"id", "text", "question", "user"}, set(res.data.keys())
            )

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

            self.assertListEqual(
                [q.id for q in ProfileAnswer.objects.all()], [q["id"] for q in res.data]
            )
            self.assertListEqual(
                [q.text for q in ProfileAnswer.objects.all()],
                [q["text"] for q in res.data],
            )
            self.assertListEqual(
                [q.question.id for q in ProfileAnswer.objects.all()],
                [q["question"] for q in res.data],
            )
            self.assertListEqual(
                [q.user.id for q in ProfileAnswer.objects.all()],
                [q["user"] for q in res.data],
            )

    ##########
    # CREATE #
    ##########

    profile_answer_17admin_create_data = {
        "text": "La bière",
        "question": 1,
        "user": "17admin",
    }
    profile_answer_17admin_invalid_create_data = {
        "text": "0",
        "question": 2,
        "user": "17admin",
    }
    profile_answer_17simple_create_data = {
        "text": "42",
        "question": 2,
        "user": "17simple",
    }

    def test_can_create_for_own_profile(self):
        for user, data in (
            ("17admin", self.profile_answer_17admin_create_data),
            ("17simple", self.profile_answer_17simple_create_data),
        ):
            self.login(user)
            res = self.create(data=data)
            self.assertStatusCode(res, 201)

            last_profile_answer = ProfileAnswer.objects.last()
            self.assertEqual(last_profile_answer.text, data["text"])
            self.assertEqual(last_profile_answer.question.id, data["question"])
            self.assertEqual(last_profile_answer.user.id, data["user"])

    def test_cannot_create_for_other_profile(self):
        for user, data in (
            ("17simple", self.profile_answer_17admin_create_data),
            ("17admin", self.profile_answer_17simple_create_data),
        ):
            self.login(user)

            length_before = ProfileAnswer.objects.count()
            res = self.create(data=data)
            self.assertStatusCode(res, 403)
            self.assertEqual(ProfileAnswer.objects.count(), length_before)

    def test_cannot_answer_twice(self):
        self.login("17admin")

        length_before = ProfileAnswer.objects.count()
        res = self.create(data=self.profile_answer_17admin_invalid_create_data)
        self.assertStatusCode(res, 400)
        self.assertEqual(ProfileAnswer.objects.count(), length_before)

    ##########
    # UPDATE #
    ##########

    profile_answer_17simple_update_data = {"text": "Les pâtes"}
    profile_answer_17admin_update_data = {"text": "0"}

    profile_answer_17admin_invalid_update_data = {"text": "0", "user": "17simple"}
    profile_answer_17admin_invalid_update_data_2 = {"text": "0", "question": "1"}

    def test_can_update_own_answer(self):
        self.login("17simple")
        res = self.update(pk=1, data=self.profile_answer_17simple_update_data)
        self.assertStatusCode(res, 200)
        profile_answer = ProfileAnswer.objects.get(pk=1)
        self.assertEqual(
            profile_answer.text, self.profile_answer_17simple_update_data["text"]
        )

        self.login("17admin")
        res = self.update(pk=2, data=self.profile_answer_17admin_update_data)
        self.assertStatusCode(res, 200)
        profile_answer = ProfileAnswer.objects.get(pk=2)
        self.assertEqual(
            profile_answer.text, self.profile_answer_17admin_update_data["text"]
        )

    def test_if_not_admin_then_cannot_update_answer_of_other_profile(self):
        self.login("17simple")
        res = self.update(pk=2, data=self.profile_answer_17admin_update_data)
        self.assertStatusCode(res, 403)
        profile_answer = ProfileAnswer.objects.get(pk=2)
        self.assertNotEqual(
            profile_answer.text, self.profile_answer_17admin_update_data["text"]
        )

    def test_if_admin_then_can_update_answer_of_other_profile(self):
        self.login("17admin")
        res = self.update(pk=1, data=self.profile_answer_17simple_update_data)
        self.assertStatusCode(res, 200)
        profile_answer = ProfileAnswer.objects.get(pk=1)
        self.assertEqual(
            profile_answer.text, self.profile_answer_17simple_update_data["text"]
        )

    def test_cannot_update_user(self):
        self.login("17admin")
        res = self.update(pk=2, data=self.profile_answer_17admin_invalid_update_data)
        self.assertStatusCode(res, 200)
        profile_answer = ProfileAnswer.objects.get(pk=2)
        self.assertNotEqual(
            profile_answer.user.id,
            self.profile_answer_17admin_invalid_update_data["user"],
        )

    def test_cannot_update_question(self):
        self.login("17admin")
        res = self.update(pk=2, data=self.profile_answer_17admin_invalid_update_data_2)
        self.assertStatusCode(res, 200)
        profile_answer = ProfileAnswer.objects.get(pk=2)
        self.assertNotEqual(
            profile_answer.question.id,
            self.profile_answer_17admin_invalid_update_data_2["question"],
        )

    ##########
    # DELETE #
    ##########

    def test_can_delete_own_answer(self):
        for user, pk in (("17simple", 1), ("17admin", 2)):
            self.login(user)
            length_before = ProfileAnswer.objects.count()
            res = self.destroy(pk)
            self.assertStatusCode(res, 204)
            self.assertEqual(length_before - 1, ProfileAnswer.objects.count())

    def test_if_not_global_admin_then_cannot_delete_other_profile_answer(self):
        self.login("17simple")

        length_before = ProfileAnswer.objects.count()
        res = self.destroy(2)
        self.assertStatusCode(res, 403)
        self.assertEqual(length_before, ProfileAnswer.objects.count())

    def test_if_global_admin_then_can_delete_other_profile_answer(self):
        self.login("17admin")

        length_before = ProfileAnswer.objects.count()
        res = self.destroy(1)
        self.assertStatusCode(res, 204)
        self.assertEqual(length_before - 1, ProfileAnswer.objects.count())
