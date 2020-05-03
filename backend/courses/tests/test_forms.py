from courses.models import Form, Question
from courses.serializers import FormSerializer

from backend.tests_utils import WeakAuthenticationBaseTestCase


class FormTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_forms.yaml"]

    EXPECTED_FIELDS = {
        "id",
        "date",
        "name",
    }

    ALL_USERS = ["17admin", "17simple"]

    def endpoint_list(self):
        return "/courses/forms/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/courses/forms/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/courses/forms/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format)

    def endpoint_update(self, pk):
        return f"/courses/forms/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format)

    def endpoint_destroy(self, pk):
        return f"/courses/forms/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
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

    create_form_data = {
        "id": 2,
        "name": "maths generic",
    }

    def test_if_not_global_admin_then_cannot_create(self):
        self.login("17simple")
        res = self.create(self.create_form_data)
        self.assertStatusCode(res, 403)
        self.assertFalse(
            Form.objects.filter(
                pk=self.create_form_data["id"]
            ).exists()
        )

    def test_if_global_admin_then_can_create(self):
        self.login("17admin")
        res = self.create(self.create_form_data)
        self.assertStatusCode(res, 201)

        self.assertTrue(
            Form.objects.filter(pk=self.create_form_data["id"]).exists()
        )
        form = Form.objects.get(pk=self.create_form_data["id"])
        self.assertEqual(form.name, self.create_form_data["name"])

    ##########
    # UPDATE #
    ##########  

    update_form_data = {
        "id": 1,
        "date": '2020-04-20T22:10:57.577Z',
        "name": "maths 2",
    }

    def test_if_not_global_admin_then_cannot_update(self):
        self.login('17simple')
        res = self.update("1", self.update_form_data)
        self.assertStatusCode(res, 403)
        self.assertTrue(Form.objects.filter(pk="1").exists())

    # This function shouldn't change the questions 
    def test_if_global_admin_then_can_update(self):
        self.login("17admin")
        res = self.update("1", self.update_form_data)
        self.assertStatusCode(res, 200)

        self.assertTrue(
            Form.objects.filter(pk=self.update_form_data["id"]).exists()
        )
        form = Form.objects.get(pk=1)
        self.assertEqual(form.name, self.update_form_data["name"])
        self.assertNotEqual(form.date, self.update_form_data["date"])
    
    ###########
    # DESTROY #
    ###########

    def test_if_not_global_admin_then_cannot_destroy(self):
        self.login('17simple')
        res = self.destroy("1")
        self.assertStatusCode(res, 403)
        self.assertTrue(Form.objects.filter(pk="1").exists())
        self.assertTrue(Question.objects.filter(pk="1").exists())

    def test_if_global_admin_then_can_destroy(self):
        self.login("17admin")
        res = self.destroy("1")
        self.assertStatusCode(res, 204)
        self.assertFalse(Form.objects.filter(pk="1").exists())
        self.assertFalse(Question.objects.filter(pk="1").exists())
