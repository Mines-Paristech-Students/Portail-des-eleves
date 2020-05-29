
import copy

from courses.models import Course
from courses.serializers import CourseSerializer

from backend.tests_utils import WeakAuthenticationBaseTestCase


class CourseTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_courses.yaml"]

    EXPECTED_FIELDS = {
        "id",
        "name",
        "form",
    }

    ALL_USERS = ["17admin", "17simple"]

    def endpoint_list(self):
        return "/courses/courses/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/courses/courses/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/courses/courses/"

    def create(self, data=None, courseat="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, courseat)

    def endpoint_update(self, pk):
        return f"/courses/courses/{pk}/"

    def update(self, pk, data=None, courseat="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, courseat)

    def endpoint_destroy(self, pk):
        return f"/courses/courses/{pk}/"

    def destroy(self, pk, data="", courseat=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk))

    def endpoint_stats(self, pk):
        return f"/courses/courses/{pk}/stats/"

    def stats(self, pk):
        return self.get(self.endpoint_stats(pk))

    def endpoint_has_voted(self, pk):
        return f"/courses/courses/{pk}/has_voted/"

    def has_voted(self, pk):
        return self.get(self.endpoint_has_voted(pk))

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

    create_course_data = {
        "id": 2,
        "name": "plop",
        "form": 1,
    }

    def test_if_not_global_admin_then_cannot_create(self):
        self.login("17simple")
        res = self.create(self.create_course_data)
        self.assertStatusCode(res, 403)
        self.assertFalse(
            Course.objects.filter(
                pk=self.create_course_data["id"]
            ).exists()
        )

    def test_if_global_admin_then_can_create(self):
        self.login("17admin")
        res = self.create(self.create_course_data)
        self.assertStatusCode(res, 201)

        self.assertTrue(
            Course.objects.filter(pk=self.create_course_data["id"]).exists()
        )
        course = Course.objects.get(pk=self.create_course_data["id"])
        self.assertEqual(course.name, self.create_course_data["name"])
        self.assertEqual(course.form.id, self.create_course_data["form"])

    ##########
    # UPDATE #
    ##########

    update_course_data = {
        "id": 1,
        "name": "maths 2",
        "form": 2,
    }

    def test_if_not_global_admin_then_cannot_update(self):
        self.login('17simple')
        res = self.update("1", self.update_course_data)
        self.assertStatusCode(res, 403)
        self.assertTrue(Course.objects.filter(pk="1").exists())

    # This function shouldn't change the questions
    def test_if_global_admin_then_can_update_only_course(self):
        self.login("17admin")
        res = self.update("1", self.update_course_data)
        self.assertStatusCode(res, 200)

        self.assertTrue(
            Course.objects.filter(pk=self.update_course_data["id"]).exists()
        )
        course = Course.objects.get(pk=1)
        self.assertEqual(course.name, self.update_course_data["name"])
        self.assertEqual(course.form.id, self.update_course_data["form"])

    ###########
    # DESTROY #
    ###########

    def test_if_not_global_admin_then_cannot_destroy(self):
        self.login('17simple')
        res = self.destroy("1")
        self.assertStatusCode(res, 403)
        self.assertTrue(Course.objects.filter(pk="1").exists())

    def test_if_global_admin_then_can_destroy(self):
        self.login("17admin")
        res = self.destroy("1")
        self.assertStatusCode(res, 204)
        self.assertFalse(Course.objects.filter(pk="1").exists())

    ###############
    # AVG_RATINGS #
    ###############

    stats_rating_1 = {
        "id": 1,
        "label": "3+3?",
        "average": 2.5,
        "histogram": {
            1: 0,
            2: 1,
            3: 1,
            4: 0,
            5: 0,
        }
    }

    num_not_archvied = 2

    def test_if_not_logged_in_then_cannot_get_stats(self):
        res = self.stats(pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_get_stats(self):
        self.login("17simple")
        res = self.stats(pk=1)
        self.assertStatusCode(res, 200)

        # Does not contain archived questions
        self.assertEqual(len(res.data), self.num_not_archvied)

        # We only check the first one
        stats_1 = res.data[0]
        for key, value in self.stats_rating_1.items():
            value_returned = stats_1[key]
            self.assertIsNotNone(value_returned)

            if isinstance(value, dict):
                self.assertDictEqual(value, value_returned)
            else:
                self.assertEqual(value, value)

    ##############
    # HAVE_VOTED #
    ##############

    def test_if_not_logged_in_then_cannot_check_has_voted(self):
        res = self.has_voted(pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_check_has_already_voted(self):
        self.login("17simple")

        res = self.has_voted(pk=1)
        self.assertStatusCode(res, 200)

        self.assertEqual(res.data["has_voted"], True)

    def test_if_logged_in_then_can_check_has_not(self):
        self.login("17bocquet")

        res = self.has_voted(pk=1)
        self.assertStatusCode(res, 200)

        self.assertEqual(res.data["has_voted"], False)