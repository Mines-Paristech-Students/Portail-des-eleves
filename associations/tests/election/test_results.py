from datetime import datetime, timezone, timedelta

from associations.models import Election, Choice, Ballot
from associations.tests.election.base_test_election import ALL_USERS, ALL_USERS_EXCEPT_ELECTION_BIERO, \
    BaseElectionTestCase


class ResultsTestCase(BaseElectionTestCase):
    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_results(self):
        res = self.results(0, 'biero')
        self.assertStatusCode(res, 401)

    def test_can_only_get_to_results(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.post(self.endpoint_results(0, 'biero'))
            self.assertNotEqual(res.status_code, 201)
            res = self.patch(self.endpoint_results(0, 'biero'))
            self.assertNotEqual(res.status_code, 200)
            res = self.delete(self.endpoint_results(0, 'biero'))
            self.assertNotEqual(res.status_code, 204)

    def test_if_not_election_admin_and_election_active_then_cannot_retrieve_results(self):
        election = Election.objects.get(pk=1)
        self.assertTrue(election.is_active, msg='The test needs election 1 to be active.')

        for user in ALL_USERS:
            if 'election_pdm' not in user:
                self.login(user)
                res = self.results(election.pk, election.association_id)
                self.assertStatusCode(res, 403)

    def test_if_election_admin_and_election_active_then_can_retrieve_results(self):
        election = Election.objects.get(pk=1)
        self.assertTrue(election.is_active, msg='The test needs election 1 to be active.')

        self.login('17election_pdm')
        res = self.results(election.pk, election.association_id)
        self.assertStatusCode(res, 200)

    def test_if_election_not_active_then_can_retrieve_results(self):
        election = Election.objects.get(pk=10)
        self.assertFalse(election.is_active, msg='The test needs election 10 not to be active.')

        for user in ALL_USERS:
            self.login(user)
            res = self.results(election.pk, election.association_id)
            self.assertStatusCode(res, 200)

    ##################
    # BUSINESS LOGIC #
    ##################

    def test_results_are_correctly_computed(self):
        def vote(vote_ids):
            self.vote(pk, 'pdm', data={'choices': vote_ids})

        def assertResults(expected_croissants, expected_raisins, expected_pommes):
            self.login('17election_pdm')

            res = self.results(pk, 'pdm')
            self.assertStatusCode(res, 200)

            croissants = res.data['results'].get('Croissant', 0)
            self.assertEqual(croissants, expected_croissants)
            raisins = res.data['results'].get('Pain aux raisins', 0)
            self.assertEqual(raisins, expected_raisins)
            pommes = res.data['results'].get('Chausson aux pommes', 0)
            self.assertEqual(pommes, expected_pommes)

        election_data = {
            'name': 'Vos viennoiseries préférées',
            'choices': [{'name': 'Croissant'}, {'name': 'Pain aux raisins'}, {'name': 'Chausson aux pommes'}],
            'registered_voters': ALL_USERS,
            'starts_at': datetime(2019, 1, 1, tzinfo=timezone.utc),
            'ends_at': datetime.now(tz=timezone.utc) + timedelta(1),
            'max_choices_per_ballot': 2,
        }

        self.login('17election_pdm')
        self.create('pdm', election_data)

        pk = Election.objects.last().id
        croissant_id = Choice.objects.get(name='Croissant').id
        raisins_id = Choice.objects.get(name='Pain aux raisins').id
        pommes_id = Choice.objects.get(name='Chausson aux pommes').id

        assertResults(0, 0, 0)

        self.login('17simple')
        vote([croissant_id, pommes_id])
        assertResults(1, 0, 1)

        self.login('17admin')
        vote([raisins_id])
        assertResults(1, 1, 1)

        self.login('17admin_biero')
        vote([croissant_id, pommes_id, raisins_id])  # Not taken into account (too many choices).
        assertResults(1, 1, 1)

        self.login('17admin_biero')
        vote([croissant_id, pommes_id])
        assertResults(2, 1, 2)

        self.login('17admin_biero')
        vote([croissant_id, pommes_id])  # Not taken into account (second vote).
        assertResults(2, 1, 2)

        self.login('17member_biero')
        vote([croissant_id, croissant_id])  # Only one “Croissant” vote taken into account.
        assertResults(3, 1, 2)
