from associations.models import Choice, Election
from associations.tests.election.base_test_election import (
    BaseElectionTestCase,
    ALL_USERS_EXCEPT_ELECTION_BIERO,
    ALL_USERS_EXCEPT_ELECTION_ADMIN,
    ALL_USERS_EXCEPT_ELECTION_PDM,
)


class ChoiceTestCase(BaseElectionTestCase):
    def list(self):
        return self.get("/associations/choices/")

    def retrieve(self, pk):
        return self.get(f"/associations/choices/{pk}/")

    def create(self, data=None, format="json"):
        return self.post("/associations/choices/", data, format)

    def update(self, pk, data=None, format="json"):
        return self.patch(f"/associations/choices/{pk}/", data, format)

    def destroy(self, pk):
        return self.delete(f"/associations/choices/{pk}/")

    ##########
    # GLOBAL #
    ##########

    def test_if_not_logged_in_then_401(self):
        self.assertStatusCode(self.list(), 401)
        self.assertStatusCode(self.retrieve(0), 401)
        self.assertStatusCode(
            self.create({"election": 0, "name": "Nouveau choix"}), 401
        )
        self.assertStatusCode(self.update(1, {"number_of_offine_votes": 42}), 401)
        self.assertStatusCode(self.destroy(1), 401)

    def test_if_not_election_admin_then_list_empty(self):
        # Every user can load the list page, they will just have no results if they are not an election admin.
        for user in ALL_USERS_EXCEPT_ELECTION_ADMIN:
            self.login(user)
            res = self.list()
            self.assertStatusCode(res, 200)
            self.assertEqual(len(res.data["results"]), 0)

    def test_if_not_election_admin_then_error(self):
        for user in ALL_USERS_EXCEPT_ELECTION_PDM:
            self.login(user)
            # 404 because the choice is not in the queryset.
            self.assertStatusCode(
                self.retrieve(20), 404, user_msg=f"Passed for {user}."
            )
            self.assertStatusCode(
                self.create({"election": 20, "name": "Un choix"}),
                403,
                user_msg=f"Passed for {user}.",
            )
            self.assertStatusCode(
                self.update(20, {"name": "Un choix"}),
                404,
                user_msg=f"Passed for {user}.",
            )
            self.assertStatusCode(self.destroy(20), 404, user_msg=f"Passed for {user}.")

    # From now on, the tests will only deal with the election administrators.

    ########
    # LIST #
    ########

    def test_only_list_association_choices(self):
        self.login("17election_biero")
        res = self.list()
        self.assertStatusCode(res, 200)
        self.assertEqual(
            res.data["count"],
            Choice.objects.filter(election__association="biero").count(),
        )
        self.assertNotEqual(
            res.data["results"],
            Choice.objects.count(),
            msg="This test is useless: add choices for another association than biero.",
        )

    ############
    # RETRIEVE #
    ############

    def test_only_retrieve_association_choices(self):
        self.login("17election_biero")

        self.assertNotEqual(
            Choice.objects.filter(election__association="biero").count(),
            Choice.objects.count(),
            msg="This test is useless: add choices for another association than biero.",
        )

        for choice in Choice.objects.all():
            res = self.retrieve(choice.id)

            if choice.election.association.id == "biero":
                self.assertStatusCode(res, 200)
            else:
                self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    def test_can_create_for_future_election(self):
        self.login("17election_pdm")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.create({"election": 20, "name": "Un choix"})

        self.assertEqual(res.status_code, 201, msg=res.data)
        self.assertEqual(
            1,
            Choice.objects.filter(
                election=20,
                name="Un choix",
                number_of_offline_votes=0,
                number_of_online_votes=0,
            ).count(),
        )

    def test_new_number_of_online_votes_is_zero(self):
        self.login("17election_pdm")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.create(
            {
                "election": 20,
                "name": "Un choix",
                "number_of_online_votes": 4,
                "number_of_offline_votes": 32,
            }
        )

        self.assertEqual(res.status_code, 201, msg=res.data)
        self.assertEqual(
            1,
            Choice.objects.filter(
                election=20,
                name="Un choix",
                number_of_offline_votes=32,
                number_of_online_votes=0,
            ).count(),
        )

    def test_cannot_create_negative_offline_votes(self):
        self.login("17election_pdm")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.create(
            {"election": 20, "name": "Un choix", "number_of_offline_votes": -32}
        )

        self.assertEqual(res.status_code, 400, msg=res.data)

    def test_cannot_create_for_old_election(self):
        self.login("17election_biero")
        self.assertTrue(Election.objects.get(pk=10).started)
        self.assertFalse(Election.objects.get(pk=10).is_active)
        length_before = Choice.objects.count()

        res = self.create({"election": 10, "name": "Un choix"})

        self.assertEqual(res.status_code, 400, msg=res.data)
        self.assertEqual(length_before, Choice.objects.count())

    def test_cannot_create_for_current_election(self):
        self.login("17election_biero")
        self.assertTrue(Election.objects.get(pk=0).is_active)
        length_before = Choice.objects.count()

        res = self.create({"election": 0, "name": "Un choix"})

        self.assertEqual(res.status_code, 400, msg=res.data)
        self.assertEqual(length_before, Choice.objects.count())

    def test_cannot_create_for_other_association_election(self):
        self.login("17election_biero")
        self.assertFalse(Election.objects.get(pk=20).started)
        length_before = Choice.objects.count()

        res = self.create({"election": 20, "name": "Un choix"})

        self.assertEqual(res.status_code, 403, msg=res.data)
        self.assertEqual(length_before, Choice.objects.count())

    ##########
    # UPDATE #
    ##########

    def test_cannot_update_other_association_choice(self):
        self.login("17election_pdm")
        for pk, data in (
            (0, {"name": "Nouveau choix"}),
            (1, {"name": "Nouveau choix"}),
            (2, {"name": "Nouveau choix"}),
            (3, {"name": "Nouveau choix"}),
            (10, {"name": "Nouveau choix", "number_of_offline_votes": 3}),
            (11, {"name": "Nouveau choix"}),
        ):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 404, msg=res.data)

        self.login("17election_biero")
        for pk, data in (
            (20, {"name": "Nouveau choix", "number_of_offline_votes": 5}),
            (21, {"name": "Nouveau choix", "number_of_offline_votes": 5}),
            (22, {"name": "Nouveau choix", "number_of_offline_votes": 5}),
        ):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 404, msg=res.data)

    def test_cannot_update_started_election_name(self):
        self.login("17election_pdm")
        for pk, data in (
            (0, {"name": "Nouveau choix"}),
            (10, {"name": "Nouveau choix"}),
        ):
            old_name = Choice.objects.get(pk=pk).name
            self.update(pk, data)
            self.assertEqual(Choice.objects.get(pk=pk).name, old_name)

    def test_cannot_update_number_of_online_votes(self):
        self.login("17election_pdm")
        for pk, data in (
            (0, {"number_of_online_votes": 3}),
            (10, {"number_of_online_votes": 3}),
        ):
            old_number = Choice.objects.get(pk=pk).number_of_online_votes
            self.update(pk, data)
            self.assertEqual(
                old_number, Choice.objects.get(pk=pk).number_of_online_votes
            )

        self.login("17election_biero")
        for pk, data in ((20, {"number_of_online_votes": 5}),):
            old_number = Choice.objects.get(pk=pk).number_of_online_votes
            self.update(pk, data)
            self.assertEqual(
                old_number, Choice.objects.get(pk=pk).number_of_online_votes
            )

    def test_can_update_number_of_offline_votes(self):
        self.login("17election_biero")
        for pk, data in (
            (0, {"number_of_offline_votes": 999}),
            (10, {"number_of_offline_votes": 999}),
        ):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 200, msg=res.data)
            self.assertEqual(Choice.objects.get(pk=pk).number_of_offline_votes, 999)

        self.login("17election_pdm")
        for pk, data in ((20, {"number_of_offline_votes": 999}),):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 200, msg=res.data)
            self.assertEqual(Choice.objects.get(pk=pk).number_of_offline_votes, 999)

    def test_cannot_update_to_negative_offline_votes(self):
        self.login("17election_biero")
        res = self.update(0, {"number_of_offline_votes": -32})
        self.assertEqual(res.status_code, 400, msg=res.data)

    def test_can_update_future_election_name(self):
        self.login("17election_pdm")
        for pk, data in ((20, {"name": "New Name"}),):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 200, msg=res.data)
            self.assertEqual(Choice.objects.get(pk=pk).name, "New Name")

    ##########
    # DELETE #
    ##########

    def test_can_delete_for_future_election(self):
        self.login("17election_pdm")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.destroy(20)

        self.assertEqual(res.status_code, 204, msg=res.data)
        self.assertFalse(Choice.objects.filter(pk=20).exists())

    def test_cannot_delete_other_association_choice(self):
        self.login("17election_biero")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.destroy(20)

        self.assertEqual(res.status_code, 404, msg=res.data)
        self.assertTrue(Choice.objects.filter(pk=20).exists())

    def test_cannot_delete_for_started_election(self):
        self.login("17election_biero")

        for pk in (0, 10):
            res = self.destroy(pk)

            self.assertEqual(res.status_code, 400, msg=res.data)
            self.assertTrue(Choice.objects.filter(pk=pk).exists())
