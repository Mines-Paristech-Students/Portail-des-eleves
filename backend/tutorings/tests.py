from datetime import date, datetime, timezone

from backend.tests_utils import WeakAuthenticationBaseTestCase
from tutorings.models import Tutoring, TutorApplication


class TutoringTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_tutoring.yaml"]

    ALL_USERS = ["17admin", "17simple"]
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return "/tutorings/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/tutorings/{pk}/"

    def retrieve(self, pk=None):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/tutorings/offer/"

    def create(self, data=None, format="json"):
        return self.post(self.endpoint_create(), data, format)

    def endpoint_update(self, pk):
        return f"/tutorings/{pk}/"

    def update(self, pk, data=None, format="json"):
        return self.patch(self.endpoint_update(pk), data, format)

    def endpoint_destroy(self, pk):
        return f"/tutorings/{pk}/"

    def destroy(self, pk):
        return self.delete(self.endpoint_destroy(pk))

    def endpoint_applytutor(self, pk):
        return f"/tutorings/{pk}/applytutor/"

    def applytutor(self, pk, data=None, format="json"):
        return self.post(self.endpoint_applytutor(pk), data, format)

    def endpoint_applicant(self, pk):
        return f"/tutorings/{pk}/applications/"

    def applicant(self, pk, data=None, format="json"):
        return self.patch(self.endpoint_applicant(pk), data, format)

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def test_if_not_admin_then_can_list_published_tutorings(self):
        self.login("17simple")
        res = self.list()
        self.assertStatusCode(res, 200)
        # Use a list comprehension here to be sure to be crystal clear on which tutorings are effectively listed.
        tutorings = [
            tutoring for tutoring in Tutoring.objects.all() if tutoring.is_active
        ]
        self.assertEqual(len(tutorings), len(res.data))
        self.assertSetEqual(
            set(tutoring.id for tutoring in tutorings),
            set(tutoring["id"] for tutoring in res.data),
        )

    def test_if_admin_then_can_list_every_tutoring(self):
        self.login("17admin")
        res = self.list()

        tutorings = Tutoring.objects.all()
        self.assertEqual(tutorings.count(), len(res.data))
        self.assertSetEqual(
            set(tutoring.id for tutoring in tutorings),
            set(tutoring["id"] for tutoring in res.data),
        )

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve(self):
        res = self.retrieve(1)
        self.assertStatusCode(res, 401)

    def test_if_tutoring_does_not_exist_then_404(self):
        for user in self.ALL_USERS:
            self.login(user)
            res = self.retrieve(42)
            self.assertStatusCode(res, 404)

    def test_if_logged_in_then_can_retrieve_own_tutoring(self):
        for user in self.ALL_USERS:
            self.login(user)

            tutoring_id = Tutoring.objects.filter(applications__state="ACCEPTED")[0].id
            res = self.retrieve(tutoring_id)
            self.assertStatusCode(res, 200)

    def test_if_logged_in_then_can_retrieve_published_tutoring(self):
        for user in self.ALL_USERS:
            self.login(user)

            for tutoring in Tutoring.objects.filter(state="ACCEPTED"):
                res = self.retrieve(tutoring.id)
                self.assertStatusCode(res, 200)

    def test_if_admin_then_can_retrieve_any_tutoring(self):
        self.login("17admin")

        for tutoring in Tutoring.objects.all():
            res = self.retrieve(tutoring.id)
            self.assertStatusCode(res, 200)

    def test_if_not_admin_then_cannot_retrieve_forbidden_tutorings(self):
        self.login("17simple")

        for tutoring in Tutoring.objects.exclude(state="ACCEPTED"):
            res = self.retrieve(tutoring.id)
            self.assertStatusCode(res, 404)

    def test_if_admin_then_can_retrieve_all_fields(self):
        self.login("17admin")

        for tutoring in Tutoring.objects.all():
            res = self.retrieve(tutoring.id)
            self.assertStatusCode(res, 200)
            self.assertSetEqual(
                set(res.data.keys()),
                {
                    "id",
                    "name",
                    "contact",
                    "state",
                    "publication_date",
                    "admin_comment",
                    "place",
                    "subject",
                    "level",
                    "frequency",
                    "time_availability",
                    "description",
                    "applications",
                },
            )

    ##########
    # CREATE #
    ##########

    create_data = {
        "name": "Pierre",
        "contact": "nom.prenom@example.com",
        "place": "15 eme arrondissement",
        "subject": "Maths",
        "level": "Terminale S",
        "frequency": "1 fois par semaine",
        "time_availability": "Jeudi soir 18h",
        "description": "Travailler pour le bac",
    }

    create_data_with_extra_fields = dict(create_data)
    create_data_with_extra_fields.update(
        {
            "state": "REVIEWING",
            "publication_date": date(2019, 1, 1),
            "admin_comment": "ok",
        }
    )

    def check_last_tutoring(self, data):
        tutoring = Tutoring.objects.order_by("id").last()
        now = datetime.now(tz=timezone.utc)
        self.assertEqual(tutoring.name, data["name"])
        self.assertEqual(tutoring.contact, data["contact"])
        self.assertEqual(tutoring.place, data["place"])
        self.assertEqual(tutoring.subject, data["subject"])
        self.assertEqual(tutoring.level, data["level"])
        self.assertEqual(tutoring.frequency, data["frequency"])
        self.assertEqual(tutoring.time_availability, data["time_availability"])
        self.assertEqual(tutoring.description, data["description"])
        self.assertTupleEqual(
            (
                tutoring.publication_date.year,
                tutoring.publication_date.month,
                tutoring.publication_date.day,
                tutoring.publication_date.hour,
                tutoring.publication_date.minute,
            ),
            (now.year, now.month, now.day, now.hour, now.minute),
        )
        self.assertEqual(tutoring.state, "REVIEWING")
        self.assertEqual(tutoring.admin_comment, "")

    def test_anyone_can_create_tutorings(self):
        res = self.create(data=self.create_data)
        self.assertStatusCode(res, 201)
        self.check_last_tutoring(self.create_data)

    def test_if_create_with_extra_fields_then_no_effect(self):
        for user in self.ALL_USERS:
            self.login(user)
            res = self.create(data=self.create_data_with_extra_fields)
            self.assertStatusCode(res, 201)
            self.check_last_tutoring(self.create_data)

    ##########
    # UPDATE #
    ##########

    update_data_simple = {
        "name": "Simple",
        "contact": "nom.prenom@example.com",
        "place": "TROLL",
        "subject": "TROLL",
        "level": "Terminale S",
        "frequency": "1 fois par semaine",
        "time_availability": "Jeudi soir 18h",
        "description": "Travailler pour le bac 30 e de l'heure",
        "user": "17simple",
        "state": "ACCEPTED",
        "publication_date": date(2019, 1, 1),
        "admin_comment": "Very good.",
    }

    update_data_admin = {
        "name": "Thomas",
        "contact": "nom.prenom@example.com",
        "place": "15 eme arrondissement",
        "subject": "Maths & Physique",
        "level": "Terminale S",
        "frequency": "1 fois par semaine",
        "time_availability": "Jeudi soir 18h",
        "description": "Travailler pour le bac 30 e de l'heure",
        "user": "17simple",
        "state": "ACCEPTED",
        "publication_date": date(2019, 1, 1),
        "admin_comment": "Very good.",
    }

    update_data_admin_with_extra_fields = dict(update_data_admin)
    update_data_admin_with_extra_fields.update({"user": "17bocquet"})

    def test_if_not_admin_then_cannot_update(self):
        self.login("17simple")

        tutorings = Tutoring.objects.exclude(user="17simple")

        for tutoring in tutorings:
            res = self.update(tutoring.id, data=self.update_data_simple)
            self.assertStatusCodeIn(res, [403, 404])

    def test_if_admin_then_can_update_with_full_data(self):
        self.login("17admin")

        for tutoring in Tutoring.objects.all():
            res = self.update(tutoring.id, data=self.update_data_admin)
            self.assertStatusCode(res, 200)
            updated_tutoring = Tutoring.objects.get(pk=tutoring.id)
            self.assertEqual(updated_tutoring.name, self.update_data_admin["name"])
            self.assertEqual(
                updated_tutoring.contact, self.update_data_admin["contact"]
            )
            self.assertEqual(updated_tutoring.place, self.update_data_admin["place"])
            self.assertEqual(
                updated_tutoring.subject, self.update_data_admin["subject"]
            )
            self.assertEqual(updated_tutoring.level, self.update_data_admin["level"])
            self.assertEqual(
                updated_tutoring.frequency, self.update_data_admin["frequency"]
            )
            self.assertEqual(
                updated_tutoring.time_availability,
                self.update_data_admin["time_availability"],
            )
            self.assertEqual(
                updated_tutoring.description, self.update_data_admin["description"]
            )
            self.assertEqual(updated_tutoring.state, self.update_data_admin["state"])
            self.assertEqual(
                updated_tutoring.admin_comment, self.update_data_admin["admin_comment"]
            )
            self.assertEqual(updated_tutoring.user.id, self.update_data_admin["user"])

    ########
    # APPLY #
    ########

    def test_if_valid_tutoring_then_can_apply_but_not_twice(self):
        # First, create a new tutoring.
        self.create(data=self.create_data)
        self.login("17admin")
        tutoring = Tutoring.objects.last()

        # Then, publish it.
        self.update(tutoring.id, data={"state": "ACCEPTED"})

        # Test if the users can apply.
        for user in self.ALL_USERS:
            self.login(user)
            res = self.applytutor(tutoring.id)
            self.assertStatusCode(res, 201)

        # Test if the users cannot apply twice.
        for user in self.ALL_USERS:
            self.login(user)
            res = self.applytutor(tutoring.id)
            self.assertStatusCode(res, 403)

    def test_if_not_valid_tutoring_then_cannot_apply(self):
        for user in self.ALL_USERS:
            self.login(user)

            for tutoring in Tutoring.objects.exclude(state="ACCEPTED"):
                res = self.applytutor(tutoring.id)
                self.assertStatusCode(res, 403)

    def test_if_admin_then_can_assign_tutoring(self):
        self.login("17admin")

        for application in TutorApplication.objects.filter(tutoring__state="ACCEPTED"):
            if application in TutorApplication.objects.exclude(
                tutoring__applications__state__contains="ACCEPTED"
            ):
                res = self.applicant(application.id, data={"state": "ACCEPTED"})
                res2 = self.update(
                    application.tutoring.id, data={"user": application.user.id}
                )
                self.assertStatusCode(res, 200)
                self.assertStatusCode(res2, 200)
                print(res.data)
                print(res2.data)
                print(application.tutoring.user)

    ##################
    # BUSINESS LOGIC #
    ##################
    def test_if_is_assigned_then_cannot_apply(self):
        for user in self.ALL_USERS:
            self.login(user)

            for tutoring in Tutoring.objects.filter(applications__state="ACCEPTED"):
                res = self.applytutor(tutoring.id)
                self.assertStatusCode(res, 403)
