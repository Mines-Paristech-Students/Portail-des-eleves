from associations.models import Election
from associations.tests.base_test import BaseTestCase

# Please see the comments on test_election.yaml to get a better understanding of the test fixtures.

ALL_USERS = ['17simple', '17admin', '17admin_biero', '17member_biero', '17election_biero', '17admin_pdm',
             '17member_pdm', '17election_pdm']
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_ELECTION_BIERO = [user for user in ALL_USERS if user != '17election_biero']
"""Same as ALL_USERS, but with 17election_biero removed."""

ALL_USERS_EXCEPT_ELECTION_ADMIN = [user for user in ALL_USERS if 'election' not in user]
"""Same as ALL_USERS, but with 17election* removed."""

ALL_USERS_EXCEPT_ADMIN = [user for user in ALL_USERS if 'admin' not in user]
"""Same as ALL_USERS, but with all the association administrators removed."""


class BaseElectionTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_election.yaml']

    def endpoint_results(self, pk, association_id):
        """Return the endpoint associated to the results action."""
        return f'/associations/{association_id}/elections/{pk}/results/'

    def results(self, pk, association_id):
        return self.get(self.endpoint_results(pk, association_id))

    def endpoint_vote(self, pk, association_id):
        """Return the endpoint associated to the vote action."""
        return f'/associations/{association_id}/elections/{pk}/vote/'

    def vote(self, pk, association_id, data=None, format='json', content_type='application/json'):
        return self.post(self.endpoint_vote(pk, association_id), data, format, content_type)

    def endpoint_list(self, association_id):
        """Return the endpoint associated to the list election action."""
        return f'/associations/{association_id}/elections/'

    def list(self, association_id):
        return self.get(self.endpoint_list(association_id))

    def endpoint_retrieve(self, pk, association_id):
        """Return the endpoint associated to the retrieve action."""
        return f'/associations/{association_id}/elections/{pk}/'

    def retrieve(self, pk, association_id):
        return self.get(self.endpoint_retrieve(pk, association_id))

    def endpoint_create(self, association_id):
        """Return the endpoint associated to the create action."""
        return f'/associations/{association_id}/elections/'

    def create(self, association_id, data=None, format='json', content_type='application/json'):
        return self.post(self.endpoint_create(association_id), data, format, content_type)

    def endpoint_update(self, pk, association_id):
        """Return the endpoint associated to the update action."""
        return f'/associations/{association_id}/elections/{pk}/'

    def update(self, pk, association_id, data=None, format='json', content_type='application/json'):
        return self.patch(self.endpoint_update(pk, association_id), data, format, content_type)

    def endpoint_destroy(self, pk, association_id):
        """Return the endpoint associated to the destroy action."""
        return f'/associations/{association_id}/elections/{pk}/'

    def destroy(self, pk, association_id, data='', format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk, association_id), data, format, content_type)

    def get_registered_to_election(self, pk):
        return [x[0] for x in Election.objects.get(pk=pk).registered_voters.values_list('id')]
