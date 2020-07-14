from datetime import datetime, timezone, timedelta

from django.core.exceptions import ObjectDoesNotExist

from associations.models import Choice, Election
from associations.tests.election.base_test_election import (
    ALL_USERS,
    ALL_USERS_EXCEPT_ELECTION_BIERO,
    BaseElectionTestCase,
    ALL_USERS_EXCEPT_ELECTION_PDM,
)


class ElectionTestCase(BaseElectionTestCase):
    def vote(self, pk, data=None, format="json"):
        return self.post(f"/associations/elections/{pk}/vote/", data, format)

    def list(self):
        return self.get("/associations/elections/")

    def retrieve(self, pk):
        return self.get(f"/associations/elections/{pk}/")

    def create(self, data=None, format="json"):
        return self.post("/associations/elections/", data, format)

    def update(self, pk, data=None, format="json"):
        return self.patch(f"/associations/elections/{pk}/", data, format)

    def destroy(self, pk):
        return self.delete(f"/associations/elections/{pk}/")

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_elections(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_elections(self):
        self.login("17simple")
        res = self.list()
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_election(self):
        res = self.retrieve(pk=0)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_election(self):
        self.login("17simple")
        res = self.retrieve(pk=0)
        self.assertStatusCode(res, 200)

    def test_if_election_does_not_exist_then_404(self):
        self.login("17simple")
        res = self.retrieve(pk=42)
        self.assertFalse(Election.objects.filter(pk="42").exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    election_data = {
        "association": "biero",
        "name": "La meilleure bière",
        "starts_at": datetime(2019, 5, 1, 00, 00, tzinfo=timezone.utc),
        "ends_at": datetime(2019, 5, 2, 00, 00, tzinfo=timezone.utc),
        "results_are_published": True,
        "max_choices_per_ballot": 1,
        "choices": [{"name": "La Kro"}, {"name": "La Despe"}],
        "voters": [{"user": "17bocquet"}, {"user": "17wan-fat"}],
    }

    inconsistent_election_data = {
        "association": "biero",
        "name": "La meilleure bière",
        "starts_at": datetime(2020, 5, 1, 00, 00, tzinfo=timezone.utc),
        "ends_at": datetime(2019, 5, 2, 00, 00, tzinfo=timezone.utc),
        "results_are_published": True,
        "max_choices_per_ballot": 1,
        "choices": [{"name": "La Kro"}, {"name": "La Despe"}],
        "voters": [{"user": "17bocquet"}, {"user": "17wan-fat"}],
    }

    def assertInstanceEqualData(self, election, data):
        self.assertEqual(election.association.id, data["association"])
        self.assertEqual(election.name, data["name"])
        self.assertEqual(election.starts_at, data["starts_at"])
        self.assertEqual(election.ends_at, data["ends_at"])
        self.assertEqual(election.results_are_published, data["results_are_published"])
        self.assertEqual(
            election.max_choices_per_ballot, data["max_choices_per_ballot"]
        )
        self.assertEqual(
            set(election.voters.values_list("user__id", flat=True)),
            set([v["user"] for v in data["voters"]]),
        )
        self.assertEqual(
            set(election.choices.values_list("name", flat=True)),
            set([c["name"] for c in data["choices"]]),
        )

    def test_if_not_election_admin_then_cannot_create_election(self):
        for user in ALL_USERS_EXCEPT_ELECTION_BIERO:
            self.login(user)
            res = self.create(data=self.election_data)
            self.assertStatusCode(res, 403, user_msg=user)
            self.assertRaises(
                ObjectDoesNotExist,
                Election.objects.get,
                name=self.election_data["name"],
            )

    def test_if_election_admin_then_can_create_election(self):
        self.login("17election_biero")  # Election administrator.
        res = self.create(data=self.election_data)
        self.assertStatusCode(res, 201)

        self.assertTrue(
            Election.objects.filter(name=self.election_data["name"]).exists()
        )
        election = Election.objects.get(name=self.election_data["name"])
        self.assertInstanceEqualData(election, self.election_data)

        for choice in self.election_data["choices"]:
            self.assertTrue(Choice.objects.filter(name=choice["name"]).exists())

    def test_cannot_create_election_with_inconsistent_dates(self):
        self.login("17election_biero")
        res = self.create(data=self.inconsistent_election_data)
        self.assertStatusCode(res, 400)

    ##########
    # UPDATE #
    ##########

    update_future_election_data = {
        "pk": 20,
        "name": "La meilleure baguette",
        "starts_at": datetime(2100, 5, 1, 00, 00, tzinfo=timezone.utc),
        "ends_at": datetime(2101, 5, 2, 00, 00, tzinfo=timezone.utc),
        "max_choices_per_ballot": 42,
        "results_are_published": True,
    }

    update_past_election_data = {"pk": 10, "results_are_published": False}

    def test_if_not_election_admin_then_cannot_update_election(self):
        for user in ALL_USERS_EXCEPT_ELECTION_PDM:
            self.login(user)
            res = self.update(
                self.update_future_election_data["pk"],
                data=self.update_future_election_data,
            )
            self.assertStatusCode(res, 403)
            self.assertNotEqual(
                Election.objects.get(pk=self.update_future_election_data["pk"]).name,
                self.update_future_election_data["name"],
            )

    def test_if_election_admin_then_can_update_future_election(self):
        self.login("17election_pdm")
        res = self.update(
            self.update_future_election_data["pk"],
            data=self.update_future_election_data,
        )
        self.assertStatusCode(res, 200)

        election = Election.objects.get(pk=self.update_future_election_data["pk"])
        self.assertEqual(election.name, self.update_future_election_data["name"])
        self.assertEqual(
            election.starts_at, self.update_future_election_data["starts_at"]
        )
        self.assertEqual(election.ends_at, self.update_future_election_data["ends_at"])
        self.assertEqual(
            election.max_choices_per_ballot,
            self.update_future_election_data["max_choices_per_ballot"],
        )
        self.assertEqual(
            election.results_are_published,
            self.update_future_election_data["results_are_published"],
        )

    def test_if_election_admin_then_can_update_past_election(self):
        self.login("17election_biero")
        res = self.update(
            self.update_past_election_data["pk"], data=self.update_past_election_data
        )
        self.assertStatusCode(res, 200)

        election = Election.objects.get(pk=self.update_past_election_data["pk"])
        self.assertEqual(
            election.results_are_published,
            self.update_past_election_data["results_are_published"],
        )

    def test_if_election_admin_then_cannot_full_update_past_election(self):
        self.login("17election_biero")
        election_before = Election.objects.get(pk=0)

        res = self.update(
            0,
            data={
                "name": "La meilleure baguette",
                "starts_at": datetime(2100, 5, 1, 00, 00, tzinfo=timezone.utc),
                "ends_at": datetime(2101, 5, 2, 00, 00, tzinfo=timezone.utc),
                "max_choices_per_ballot": 42,
                "results_are_published": True,
            },
        )
        self.assertStatusCode(res, 200)

        self.assertEqual(election_before, Election.objects.get(pk=0))

    def test_if_election_admin_then_cannot_update_election_with_inconsistent_dates(
        self,
    ):
        self.login("17election_pdm")
        election_before = Election.objects.get(pk=20)
        data = {
            "pk": 20,
            "starts_at": election_before.ends_at + timedelta(1),
            "name": "Changement de date",
        }

        res = self.update(data["pk"], data=data)
        self.assertStatusCode(res, 400)

        election_after = Election.objects.get(pk=20)
        self.assertEqual(election_before, election_after)

    def test_cannot_update_association_field(self):
        self.login("17election_biero")
        data = {"pk": 0, "association": "pdm"}
        res = self.update(data["pk"], data=data)
        self.assertStatusCode(res, 200)
        self.assertEqual(Election.objects.get(pk=0).association.pk, "biero")

    ###########
    # DESTROY #
    ###########

    def test_if_not_election_admin_then_cannot_destroy_election(self):
        for user in ALL_USERS_EXCEPT_ELECTION_BIERO:
            self.login(user)
            res = self.destroy(0)
            self.assertStatusCode(res, 403)
            self.assertTrue(Election.objects.filter(pk=0).exists())

    def test_if_election_admin_then_can_destroy_future_election(self):
        self.login("17election_pdm")  # Election administrator.
        res = self.destroy(20)
        self.assertStatusCode(res, 204)
        self.assertFalse(Election.objects.filter(pk=20).exists())

    def test_if_election_admin_then_cannot_destroy_started_election(self):
        self.login("17election_biero")  # Election administrator.

        for pk in (0, 10):
            res = self.destroy(pk)
            self.assertStatusCode(res, 400)
            self.assertTrue(Election.objects.filter(pk=pk).exists())
