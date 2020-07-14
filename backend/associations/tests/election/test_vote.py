from datetime import datetime, timezone, timedelta

from associations.models import Election, Choice, Voter
from associations.tests.election.base_test_election import (
    ALL_USERS,
    BaseElectionTestCase,
    ALL_USERS_EXCEPT_ELECTION_BIERO,
)


class VoteTestCase(BaseElectionTestCase):
    def vote(self, pk, data=None, format="json"):
        return self.put(f"/associations/elections/{pk}/vote/", data, format)

    def test_if_not_logged_in_then_cannot_vote(self):
        res = self.vote(0)
        self.assertStatusCode(res, 401)

    ##################
    # BUSINESS LOGIC #
    ##################

    def test_vote(self):
        # Create an election in the future.
        self.login("17election_pdm")
        self.assertStatusCode(
            self.post(
                "/associations/elections/",
                {
                    "association": "pdm",
                    "name": "Vos viennoiseries préférées",
                    "starts_at": datetime(2100, 5, 1, 00, 00, tzinfo=timezone.utc),
                    "ends_at": datetime(2200, 5, 2, 00, 00, tzinfo=timezone.utc),
                    "results_are_published": False,
                    "max_choices_per_ballot": 2,
                    "choices": [
                        {"name": "Croissant"},
                        {"name": "Pain aux raisins"},
                        {"name": "Chausson aux pommes"},
                    ],
                    "voters": [
                        {"user": user} for user in ALL_USERS_EXCEPT_ELECTION_BIERO
                    ],
                },
                "json",
            ),
            201,
        )

        election_id = Election.objects.get(name="Vos viennoiseries préférées").id
        croissant_id = Choice.objects.get(name="Croissant").id
        raisins_id = Choice.objects.get(name="Pain aux raisins").id
        pommes_id = Choice.objects.get(name="Chausson aux pommes").id

        def vote(choices):
            return self.vote(election_id, data={"choices": choices})

        self.login("17admin")
        self.assertStatusCode(
            vote([croissant_id, raisins_id]), 403
        )  # Inactive election.

        # Change the name and make the election active.
        self.login("17election_pdm")
        self.assertStatusCode(
            self.patch(
                f"/associations/elections/{election_id}/",
                {
                    "name": "Vos viennoiseries préférées (2 choix)",
                    "starts_at": datetime.today() - timedelta(days=7),
                },
            ),
            200,
        )

        def assertResults(expected_croissants, expected_raisins, expected_pommes):
            self.assertEqual(
                Choice.objects.get(pk=croissant_id).number_of_votes, expected_croissants
            )
            self.assertEqual(
                Choice.objects.get(pk=raisins_id).number_of_votes, expected_raisins
            )
            self.assertEqual(
                Choice.objects.get(pk=pommes_id).number_of_votes, expected_pommes
            )

        assertResults(0, 0, 0)

        self.login("17simple")
        self.assertStatusCode(vote([croissant_id, pommes_id]), 200)
        assertResults(1, 0, 1)

        self.login("17admin")
        self.assertStatusCode(
            vote([croissant_id, pommes_id, raisins_id]), 400
        )  # Not taken into account (too many choices).
        assertResults(1, 0, 1)

        self.login("17admin")
        self.assertStatusCode(vote([]), 400)  # Not taken into account (no choice).
        assertResults(1, 0, 1)

        self.login("17admin")
        vote([raisins_id])
        assertResults(1, 1, 1)

        self.login("17admin")
        self.assertStatusCode(
            vote([croissant_id, pommes_id]), 403
        )  # Not taken into account (second vote).
        assertResults(1, 1, 1)

        self.login("17admin_biero")
        vote([croissant_id, pommes_id])
        assertResults(2, 1, 2)

        self.login("17member_biero")
        self.assertStatusCode(
            vote([croissant_id, croissant_id]), 200
        )  # Only one “Croissant” vote taken into account.
        assertResults(3, 1, 2)

        # Cannot vote (not registered).
        self.login("17election_biero")
        self.assertStatusCode(vote([raisins_id]), 403)

        # Nobody can see the results.
        for user in ALL_USERS:
            self.login(user)
            res = self.get(f"/associations/elections/{election_id}/")
            self.assertStatusCode(res, 200)

            for choice in res.data["choices"]:
                self.assertFalse("number_of_votes" in choice)

        # Even if the results are published (because the election is not over).
        self.login("17election_pdm")
        self.assertStatusCode(
            self.patch(
                f"/associations/elections/{election_id}/",
                {"results_are_published": True},
            ),
            200,
        )

        for user in ALL_USERS:
            self.login(user)
            res = self.get(f"/associations/elections/{election_id}/")
            self.assertStatusCode(res, 200)

            for choice in res.data["choices"]:
                self.assertFalse("number_of_votes" in choice)

        # Do as if the election is over.
        election = Election.objects.get(pk=election_id)
        election.ends_at = datetime.now(tz=timezone.utc) - timedelta(days=3)
        election.save()
        self.assertTrue(election.show_results)

        # Now the users have access to the results.
        for user in ALL_USERS:
            self.login(user)
            res = self.get(f"/associations/elections/{election_id}/")
            self.assertStatusCode(res, 200)

            for choice in res.data["choices"]:
                if choice["name"] == "Croissant":
                    self.assertEqual(choice["number_of_votes"], 3)
                elif choice["name"] == "Pain aux raisins":
                    self.assertEqual(choice["number_of_votes"], 1)
                elif choice["name"] == "Chausson aux pommes":
                    self.assertEqual(choice["number_of_votes"], 2)

        # Add an offline vote -- and voter.
        self.login("17election_pdm")
        voter = Voter.objects.get(election=election_id, user__pk="17election_pdm")
        self.assertStatusCode(
            self.patch(
                f"/associations/voters/{voter.id}/", {"status": "OFFLINE_VOTE"}, "json"
            ),
            200,
        )
        self.assertStatusCode(
            self.patch(
                f"/associations/choices/{croissant_id}/",
                {"number_of_offline_votes": 1},
                "json",
            ),
            200,
        )

        # Check the results.
        for user in ALL_USERS:
            self.login(user)
            res = self.get(f"/associations/elections/{election_id}/")
            self.assertStatusCode(res, 200)

            for choice in res.data["choices"]:
                if choice["name"] == "Croissant":
                    self.assertEqual(choice["number_of_votes"], 4)
                elif choice["name"] == "Pain aux raisins":
                    self.assertEqual(choice["number_of_votes"], 1)
                elif choice["name"] == "Chausson aux pommes":
                    self.assertEqual(choice["number_of_votes"], 2)
