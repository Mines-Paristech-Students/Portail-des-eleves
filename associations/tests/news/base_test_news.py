from associations.tests.base_test import BaseTestCase

# Please see the comments on test_news.yaml to get a better understanding of the test fixtures.

ALL_USERS = ['17admin_biero', '17member_biero', '17news_biero', '17admin_pdm', '17member_pdm', '17news_pdm']
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_NEWS_BIERO = [user for user in ALL_USERS if user != '17news_biero']
"""Same as ALL_USERS, but with 17news_biero removed."""

ALL_USERS_EXCEPT_NEWS_ADMIN = [user for user in ALL_USERS if 'news' not in user]
"""Same as ALL_USERS, but with 17news* removed."""

ALL_USERS_EXCEPT_ADMIN = [user for user in ALL_USERS if 'admin' not in user]
"""Same as ALL_USERS, but with all the association administrators removed."""


class BaseNewsTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_news.yaml']

    def endpoint_list_subscribed(self):
        """Return the endpoint associated to the list subscribed news action."""
        return f'/news/'

    def list_subscribed(self):
        return self.get(self.endpoint_list_subscribed())

    def endpoint_list_association(self, association_id):
        """Return the endpoint associated to the list association news action."""
        return f'/associations/{association_id}/news/'

    def list_association(self, association_id):
        return self.get(self.endpoint_list_association(association_id))

    def endpoint_retrieve(self, pk, association_id):
        """Return the endpoint associated to the retrieve action."""
        return f'/associations/{association_id}/news/{pk}/'

    def retrieve(self, pk, association_id):
        return self.get(self.endpoint_retrieve(pk, association_id))

    def endpoint_create(self, association_id):
        """Return the endpoint associated to the create action."""
        return f'/associations/{association_id}/news/'

    def create(self, association_id, data=None, format='json', content_type='application/json'):
        return self.post(self.endpoint_create(association_id), data, format, content_type)

    def endpoint_update(self, pk, association_id):
        """Return the endpoint associated to the update action."""
        return f'/associations/{association_id}/news/{pk}/'

    def update(self, pk, association_id, data=None, format='json', content_type='application/json'):
        return self.patch(self.endpoint_update(pk, association_id), data, format, content_type)

    def endpoint_destroy(self, pk, association_id):
        """Return the endpoint associated to the destroy action."""
        return f'/associations/{association_id}/news/{pk}/'

    def destroy(self, pk, association_id, data='', format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk, association_id), data, format, content_type)
