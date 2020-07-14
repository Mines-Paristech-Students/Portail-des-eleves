from associations.models import Voter, Election
from associations.tests.election.base_test_election import (
    BaseElectionTestCase,
    ALL_USERS_EXCEPT_ELECTION_BIERO,
    ALL_USERS_EXCEPT_ELECTION_ADMIN,
    ALL_USERS_EXCEPT_ELECTION_PDM,
)


class VoterTestCase(BaseElectionTestCase):
    def list(self):
        return self.get("/associations/voters/")

    def retrieve(self, pk):
        return self.get(f"/associations/voters/{pk}/")

    def create(self, data=None, format="json"):
        return self.post("/associations/voters/", data, format)

    def update(self, pk, data=None, format="json"):
        return self.patch(f"/associations/voters/{pk}/", data, format)

    def destroy(self, pk):
        return self.delete(f"/associations/voters/{pk}/")

    ##########
    # GLOBAL #
    ##########

    def test_if_not_logged_in_then_401(self):
        self.assertStatusCode(self.list(), 401)
        self.assertStatusCode(self.retrieve(0), 401)
        self.assertStatusCode(
            self.create({"election": 20, "user": "17admin_biero"}), 401
        )
        self.assertStatusCode(self.update(1, {"status": "OFFLINE_VOTE"}), 401)
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
            # 404 because the voter is not in the queryset.
            self.assertStatusCode(
                self.retrieve(21), 404, user_msg=f"Passed for {user}."
            )
            self.assertStatusCode(
                self.create({"election": 20, "user": "17admin_biero"}),
                403,
                user_msg=f"Passed for {user}.",
            )
            self.assertStatusCode(
                self.update(21, {"status": "OFFLINE_VOTE"}),
                404,
                user_msg=f"Passed for {user}.",
            )
            self.assertStatusCode(self.destroy(21), 404, user_msg=f"Passed for {user}.")

    # From now on, the tests will only deal with the election administrators.

    ########
    # LIST #
    ########

    def test_only_list_association_voters(self):
        self.login("17election_biero")
        res = self.list()
        self.assertStatusCode(res, 200)
        self.assertEqual(
            res.data["count"],
            Voter.objects.filter(election__association="biero").count(),
        )
        self.assertNotEqual(
            res.data["results"],
            Voter.objects.count(),
            msg="This test is useless: add voters for another association than biero.",
        )

    ############
    # RETRIEVE #
    ############

    def test_only_retrieve_association_voters(self):
        self.login("17election_biero")

        self.assertNotEqual(
            Voter.objects.filter(election__association="biero").count(),
            Voter.objects.count(),
            msg="This test is useless: add voters for another association than biero.",
        )

        for voter in Voter.objects.all():
            res = self.retrieve(voter.id)

            if voter.election.association.id == "biero":
                self.assertStatusCode(res, 200)
            else:
                self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    def test_can_create_for_future_election(self):
        self.login("17election_pdm")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.create({"election": 20, "user": "17admin_biero"})

        self.assertEqual(res.status_code, 201, msg=res.data)
        self.assertEqual(
            1,
            Voter.objects.filter(
                election=20, user="17admin_biero", status="PENDING"
            ).count(),
        )

    def test_can_create_with_pending_only(self):
        self.login("17election_pdm")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.create(
            {"election": 20, "user": "17admin_biero", "status": "ONLINE_VOTE"}
        )

        self.assertEqual(res.status_code, 201, msg=res.data)
        self.assertEqual(
            1,
            Voter.objects.filter(
                election=20, user="17admin_biero", status="PENDING"
            ).count(),
        )

    def test_cannot_create_for_old_election(self):
        self.login("17election_biero")
        self.assertTrue(Election.objects.get(pk=10).started)
        self.assertFalse(Election.objects.get(pk=10).is_active)
        length_before = Voter.objects.count()

        res = self.create({"election": 10, "user": "17admin_biero"})

        self.assertEqual(res.status_code, 400, msg=res.data)
        self.assertEqual(length_before, Voter.objects.count())

    def test_cannot_create_for_current_election(self):
        self.login("17election_biero")
        self.assertTrue(Election.objects.get(pk=0).is_active)
        length_before = Voter.objects.count()

        res = self.create({"election": 0, "user": "17admin_biero"})

        self.assertEqual(res.status_code, 400, msg=res.data)
        self.assertEqual(length_before, Voter.objects.count())

    def test_cannot_create_for_other_association_election(self):
        self.login("17election_biero")
        self.assertFalse(Election.objects.get(pk=20).started)
        length_before = Voter.objects.count()

        res = self.create({"election": 20, "user": "17admin_biero"})

        self.assertEqual(res.status_code, 403, msg=res.data)
        self.assertEqual(length_before, Voter.objects.count())

    ##########
    # UPDATE #
    ##########

    def test_cannot_update_other_association_voter(self):
        self.login("17election_pdm")
        for pk, data in (
            (0, {"status": "OFFLINE_VOTE"}),
            (1, {"status": "ONLINE_VOTE"}),
            (2, {"status": "OFFLINE_VOTE"}),
            (3, {"status": "PENDING"}),
            (10, {"status": "OFFLINE_VOTE"}),
            (11, {"status": "ONLINE_VOTE"}),
            (12, {"status": "OFFLINE_VOTE", "election": 0}),
            (13, {"status": "PENDING", "user": "17election_pdm"}),
        ):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 404, msg=res.data)

        self.login("17election_biero")
        for pk, data in (
            (20, {"status": "OFFLINE_VOTE"}),
            (21, {"status": "ONLINE_VOTE"}),
            (22, {"status": "OFFLINE_VOTE"}),
            (23, {"status": "PENDING"}),
        ):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 404, msg=res.data)

    def test_cannot_update_future_election(self):
        self.login("17election_pdm")
        for pk, data in (
            (20, {"status": "OFFLINE_VOTE"}),
            (21, {"status": "OFFLINE_VOTE"}),
            (22, {"status": "OFFLINE_VOTE"}),
            (23, {"status": "OFFLINE_VOTE"}),
        ):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 400, msg=res.data)

    def test_can_update_voter_status(self):
        self.login("17election_biero")
        for pk, data in (
            (0, {"status": "OFFLINE_VOTE"}),
            (10, {"status": "OFFLINE_VOTE"}),
            (11, {"status": "OFFLINE_VOTE"}),
            (12, {"status": "OFFLINE_VOTE"}),
        ):
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 200, msg=res.data)
            self.assertEqual(Voter.objects.get(pk=pk).status, "OFFLINE_VOTE")

    def test_cannot_update_to_invalid_status(self):
        self.login("17election_biero")
        for pk, data in (
            (0, {"status": "ONLINE_VOTE"}),
            (1, {"status": "ONLINE_VOTE"}),
            (2, {"status": "OFFLINE_VOTE"}),
            (3, {"status": "PENDING"}),
            (10, {"status": "ONLINE_VOTE"}),
            (11, {"status": "ONLINE_VOTE"}),
            (13, {"status": "PENDING"}),
        ):
            status_before = Voter.objects.get(pk=pk).status
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 400, msg=res.data)
            self.assertEqual(Voter.objects.get(pk=pk).status, status_before)

    def test_can_only_update_status(self):
        self.login("17election_biero")
        for pk, data in (
            (0, {"user": "17election_biero", "status": "OFFLINE_VOTE"}),
            (10, {"election": 0, "user": "17election_biero", "status": "OFFLINE_VOTE"}),
        ):
            user_before = Voter.objects.get(pk=pk).user.id
            election_before = Voter.objects.get(pk=pk).election.id
            res = self.update(pk, data)
            self.assertEqual(res.status_code, 200, msg=res.data)
            self.assertEqual(Voter.objects.get(pk=pk).status, "OFFLINE_VOTE")
            self.assertEqual(Voter.objects.get(pk=pk).user.id, user_before)
            self.assertEqual(Voter.objects.get(pk=pk).election.id, election_before)

    ##########
    # DELETE #
    ##########

    def test_can_delete_for_future_election(self):
        self.login("17election_pdm")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.destroy(20)

        self.assertEqual(res.status_code, 204, msg=res.data)
        self.assertFalse(Voter.objects.filter(pk=20).exists())

    def test_cannot_delete_other_association_voter(self):
        self.login("17election_biero")
        self.assertFalse(Election.objects.get(pk=20).started)

        res = self.destroy(20)

        self.assertEqual(res.status_code, 404, msg=res.data)
        self.assertTrue(Voter.objects.filter(pk=20).exists())

    def test_cannot_delete_for_started_election(self):
        self.login("17election_biero")

        for pk in (0, 10):
            res = self.destroy(pk)

            self.assertEqual(res.status_code, 400, msg=res.data)
            self.assertTrue(Voter.objects.filter(pk=pk).exists())
