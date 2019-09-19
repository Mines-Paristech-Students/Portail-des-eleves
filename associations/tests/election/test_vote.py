from associations.models import Election, Vote
from associations.tests.election.base_test_election import ALL_USERS, BaseElectionTestCase


class VoteTestCase(BaseElectionTestCase):
    valid_vote_data_for_0 = {
        'choices': [0, 1]
    }

    invalid_vote_data_for_0 = {
        'choices': [4, 5]
    }

    valid_vote_data_for_1 = {
        'choices': [4, 5]
    }

    def test_if_not_logged_in_then_cannot_vote(self):
        res = self.vote(0, 'biero', data=self.valid_vote_data_for_0)
        self.assertStatusCode(res, 401)

    def test_if_vote_to_non_existing_association_or_election_then_404(self):
        for user in ALL_USERS:
            self.login(user)

            res = self.vote(0, 'piche', data=self.valid_vote_data_for_0)
            self.assertStatusCode(res, 404)

            res = self.vote(42, 'piche', data=self.valid_vote_data_for_0)
            self.assertStatusCode(res, 404)

            res = self.vote(42, 'biero', data=self.valid_vote_data_for_0)
            self.assertStatusCode(res, 404)

            res = self.vote(1, 'biero', data=self.valid_vote_data_for_0)
            self.assertStatusCode(res, 404)

    def test_if_logged_in_and_registered_then_can_vote(self):
        for user in ALL_USERS:
            if user in self.get_registered_to_election(0):
                self.login(user)

                length_before = Vote.objects.count()
                res = self.vote(0, 'biero', data=self.valid_vote_data_for_0)
                self.assertStatusCode(res, 201)
                self.assertEqual(Vote.objects.count(), length_before + 1)

    def test_if_logged_in_and_registered_then_cannot_vote_with_invalid_choices(self):
        for user in ALL_USERS:
            if user in self.get_registered_to_election(0):
                self.login(user)

                length_before = Vote.objects.count()
                res = self.vote(0, 'biero', data=self.invalid_vote_data_for_0)
                self.assertStatusCode(res, 400)
                self.assertEqual(Vote.objects.count(), length_before)

    def test_if_logged_in_and_not_registered_then_cannot_vote(self):
        for user in ALL_USERS:
            if user not in self.get_registered_to_election(0):
                self.login(user)

                length_before = Vote.objects.count()
                res = self.vote(0, 'biero', data=self.valid_vote_data_for_0)
                self.assertStatusCode(res, 403)
                self.assertEqual(Vote.objects.count(), length_before)

    def test_if_logged_in_and_registered_then_cannot_vote_twice(self):
        for user in ALL_USERS:
            if user in self.get_registered_to_election(0):
                self.login(user)

                length_before = Vote.objects.count()
                res = self.vote(0, 'biero', data=self.valid_vote_data_for_0)
                self.assertStatusCode(res, 201)
                self.assertEqual(Vote.objects.count(), length_before + 1)

                res = self.vote(0, 'biero', data=self.valid_vote_data_for_0)
                self.assertStatusCode(res, 403)
                self.assertEqual(Vote.objects.count(), length_before + 1)

    def test_if_registered_then_cannot_vote_with_more_votes_than_allowed(self):
        for user in ALL_USERS:
            if user in self.get_registered_to_election(1):
                self.login(user)

                length_before = Vote.objects.count()
                res = self.vote(1, 'pdm', data=self.valid_vote_data_for_1)
                self.assertStatusCode(res, 400)
                self.assertEqual(Vote.objects.count(), length_before)

    def test_if_election_inactive_then_cannot_vote(self):
        election = Election.objects.get(pk=10)
        self.assertFalse(election.is_active, msg='The test needs election 10 end date to be inactive.')

        for user in ALL_USERS:
            if user in self.get_registered_to_election(10):
                self.login(user)

                length_before = Vote.objects.count()
                res = self.vote(10, 'biero', data={'choices': [10]})
                self.assertStatusCode(res, 403)
                self.assertEqual(Vote.objects.count(), length_before)
