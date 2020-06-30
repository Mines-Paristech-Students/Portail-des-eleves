import copy

from courses.models import Question
from backend.tests_utils import WeakAuthenticationBaseTestCase


class QuestionTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_courses.yaml"]

    EXPECTED_FIELDS = {"id", "category", "label", "required", "archived", "form"}

    ALL_USERS = ["17admin", "17simple"]

    def endpoint_list(self):
        return "/courses/questions/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/courses/questions/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/courses/questions/"

    def create(self, data=None, questionat="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, questionat)

    def endpoint_update(self, pk):
        return f"/courses/questions/{pk}/"

    def update(self, pk, data=None, questionat="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, questionat)

    def endpoint_destroy(self, pk):
        return f"/courses/questions/{pk}/"

    def destroy(self, pk, data="", questionat=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk))

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def if_logged_in_then_can_list(self):
        print(self.login("17simple"))
        res = self.list()

        self.assertStatusCode(res, 200)
        for association in res.data:
            self.assertSetEqual(set(association.keys()), self.EXPECTED_FIELDS)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve(self):
        res = self.retrieve("1")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve(self):
        self.login("17simple")
        res = self.retrieve("1")

        self.assertStatusCode(res, 200)
        self.assertSetEqual(set(res.data), self.EXPECTED_FIELDS)

    ##########
    # CREATE #
    ##########

    create_question_data = {"label": "test", "category": "C", "form": 1}

    def test_if_not_global_admin_then_cannot_create(self):
        self.login("17simple")
        res = self.create(self.create_question_data)
        self.assertStatusCode(res, 403)

    def test_if_global_admin_then_can_create(self):
        self.login("17admin")
        res = self.create(self.create_question_data)
        self.assertStatusCode(res, 201)

        for key, value in self.create_question_data.items():
            self.assertEqual(res.data[key], value)

    ##########
    # UPDATE #
    ##########

    update_question_data = {
        "id": 1,
        "label": "maths 2",
        "required": False,
        "archived": False,
    }

    def test_if_not_global_admin_then_cannot_update(self):
        self.login("17simple")
        res = self.update("1", self.update_question_data)
        self.assertStatusCode(res, 403)

    def test_if_global_admin_then_can_update(self):
        self.login("17admin")
        res = self.update("1", self.update_question_data)
        self.assertStatusCode(res, 200)

        for key, value in self.update_question_data.items():
            self.assertEqual(res.data[key], value)

    def test_if_global_admin_then_cannot_update_category(self):
        fake_data = copy.deepcopy(self.update_question_data)
        fake_data["category"] = "C"

        self.login("17admin")
        res = self.update("1", fake_data)

        self.assertStatusCode(res, 200)
        self.assertEqual(res.data["category"], "R")

    ###########
    # DESTROY #
    ###########

    def test_if_not_global_admin_then_cannot_destroy(self):
        self.login("17simple")
        res = self.destroy("1")
        self.assertStatusCode(res, 403)
        self.assertTrue(Question.objects.filter(pk="1").exists())

    def test_if_global_admin_then_can_destroy(self):
        self.login("17admin")
        res = self.destroy("1")
        self.assertStatusCode(res, 204)
        self.assertFalse(Question.objects.filter(pk="1").exists())
