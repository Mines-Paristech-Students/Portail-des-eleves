from datetime import datetime, timezone, timedelta

from django.core.exceptions import ObjectDoesNotExist

from associations.models import Choice, Election
from associations.tests.election.base_test_election import ALL_USERS, ALL_USERS_EXCEPT_ELECTION_BIERO,\
    BaseElectionTestCase


class ElectionTestCase(BaseElectionTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_elections(self):
        res = self.list(association_id='biero')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_elections(self):
        self.login('17simple')
        res = self.list(association_id='biero')
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_election(self):
        res = self.retrieve(association_id='biero', pk=0)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_election(self):
        self.login('17simple')
        res = self.retrieve(association_id='biero', pk=0)
        self.assertStatusCode(res, 200)

    def test_if_election_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.retrieve(association_id='biero', pk=42)
        self.assertFalse(Election.objects.filter(pk='42').exists())
        self.assertStatusCode(res, 404)

    def test_retrieved_data(self):
        all_fields = {'id', 'association', 'name', 'choices', 'registered_voters', 'starts_at', 'ends_at',
                      'max_choices_per_vote', 'voters', 'votes'}
        fields_forbidden_to_simple = {'registered_voters', 'voters', 'votes'}
        fields_forbidden_to_election_admin = {'voters', 'votes'}

        for user in ALL_USERS:
            self.login(user)
            res = self.retrieve(association_id='biero', pk=0)
            self.assertStatusCode(res, 200)

            if user == '17election_biero':
                self.assertSetEqual(set(res.data.keys()), all_fields - fields_forbidden_to_election_admin)
            else:
                self.assertSetEqual(set(res.data.keys()), all_fields - fields_forbidden_to_simple)

    ##########
    # CREATE #
    ##########

    election_data = {
        'name': 'La meilleure bière',
        'choices': [{'name': 'La Kro'}, {'name': 'La Despe'}],
        'registered_voters': ['17bocquet', '17wan-fat'],
        'starts_at': datetime(2019, 5, 1, 00, 00, tzinfo=timezone.utc),
        'ends_at': datetime(2019, 5, 2, 00, 00, tzinfo=timezone.utc),
        'max_choices_per_vote': 1,
    }

    inconsistent_election_data = {
        'name': 'La meilleure bière',
        'choices': [{'name': 'La Kro'}, {'name': 'La Despe'}],
        'registered_voters': ['17bocquet', '17wan-fat'],
        'starts_at': datetime(2020, 5, 1, 00, 00, tzinfo=timezone.utc),
        'ends_at': datetime(2019, 5, 2, 00, 00, tzinfo=timezone.utc),
        'max_choices_per_vote': 1,
    }

    def assertInstanceEqualData(self, election, data):
        self.assertEqual(election.name, data['name'])
        self.assertEqual(election.starts_at, data['starts_at'])
        self.assertEqual(election.ends_at, data['ends_at'])
        self.assertEqual(election.max_choices_per_vote, data['max_choices_per_vote'])
        self.assertEqual(set([v[0] for v in election.registered_voters.values_list('id')]),
                         set(data['registered_voters']))
        self.assertEqual(set([c[0] for c in election.choices.values_list('name')]),
                         set([c['name'] for c in data['choices']]))

    def test_if_not_election_admin_then_cannot_create_election(self):
        for user in ALL_USERS_EXCEPT_ELECTION_BIERO:
            self.login(user)
            res = self.create(association_id='biero', data=self.election_data)
            self.assertStatusCode(res, 403, user_msg=user)
            self.assertRaises(ObjectDoesNotExist, Election.objects.get, name=self.election_data['name'])

    def test_if_election_admin_then_can_create_election(self):
        self.login('17election_biero')  # Election administrator.
        res = self.create(association_id='biero', data=self.election_data)
        self.assertStatusCode(res, 201)

        self.assertTrue(Election.objects.filter(name=self.election_data['name']).exists())
        election = Election.objects.get(name=self.election_data['name'])
        self.assertInstanceEqualData(election, self.election_data)

        for choice in self.election_data['choices']:
            self.assertTrue(Choice.objects.filter(name=choice['name']).exists())


    def test_cannot_create_election_with_inconsistent_dates(self):
        self.login('17election_biero')
        res = self.create(association_id='biero', data=self.inconsistent_election_data)
        self.assertStatusCode(res, 400)

    ##########
    # UPDATE #
    ##########

    update_election_data = {
        'pk': 0,
        'name': 'Le meilleur préz',
        'choices': [{'name': '17fornara'}, {'name': '18magne'}],
        'registered_voters': ['17member_pdm', '17election_biero'],
        'starts_at': datetime(2019, 5, 1, 00, 00, tzinfo=timezone.utc),
        'ends_at': datetime(2019, 5, 2, 00, 00, tzinfo=timezone.utc),
        'max_choices_per_vote': 1,
    }

    def test_if_not_election_admin_then_cannot_update_election(self):
        for user in ALL_USERS_EXCEPT_ELECTION_BIERO:
            self.login(user)
            res = self.update(self.update_election_data['pk'], data=self.update_election_data, association_id='biero')
            self.assertStatusCode(res, 403)
            self.assertNotEqual(Election.objects.get(pk=self.update_election_data['pk']).name,
                                self.update_election_data['name'])

    def test_if_election_admin_then_can_update_election_with_allowed_data(self):
        self.login('17election_biero')
        res = self.update(self.update_election_data['pk'], data=self.update_election_data, association_id='biero')
        self.assertStatusCode(res, 200)

        election = Election.objects.get(pk=self.update_election_data['pk'])
        self.assertInstanceEqualData(election, self.update_election_data)

    def test_if_election_admin_then_cannot_update_election_with_inconsistent_dates(self):
        self.login('17election_biero')
        election_before = Election.objects.get(pk=1)
        data = {'pk': 0,
                'starts_at': election_before.ends_at + timedelta(1),
                'name': 'Changement de date'}

        res = self.update(data['pk'], data=data, association_id='biero')
        self.assertStatusCode(res, 400)

        election_after = Election.objects.get(pk=1)
        self.assertEqual(election_before, election_after)

    def test_if_election_admin_then_can_update_registered_voters(self):
        self.login('17election_biero')
        data = {'pk': 0,
                'registered_voters': ['17election_biero', '17member_biero']}
        res = self.update(data['pk'], 'biero', data=data)
        self.assertStatusCode(res, 200)
        self.assertSetEqual(
            set([x['registered_voters'] for x in Election.objects.filter(pk=0).values('registered_voters')]),
            set(data['registered_voters'])
        )

    ###########
    # DESTROY #
    ###########

    def test_if_not_election_admin_then_cannot_destroy_election(self):
        for user in ALL_USERS_EXCEPT_ELECTION_BIERO:
            self.login(user)
            res = self.destroy(0, association_id='biero')
            self.assertStatusCode(res, 403)
            self.assertTrue(Election.objects.filter(pk=0).exists())

    def test_if_election_admin_then_can_destroy_election(self):
        self.login('17election_biero')  # Election administrator.
        res = self.destroy(0, 'biero')
        self.assertStatusCode(res, 204)
        self.assertFalse(Election.objects.filter(pk=0).exists())
