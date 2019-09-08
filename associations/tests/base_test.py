from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class BaseTestCase(TestCase):
    client = APIClient(enforce_csrf_checks=True)

    api_base = '/api/v1/'

    def logout(self):
        """Log the current user out."""
        self.client.logout()

    def login(self, username, password='password'):
        """
        Log an user in.
        :param str username: the user's username.
        :param str password: the user's password (default: password, should not change)
        :return: the response from token_obtain_pair.
        """

        self.logout()

        url = reverse('token_obtain_pair')
        data = {'id': username, 'password': password}
        return self.client.post(url, data, format='json')

    def delete(self, endpoint=''):
        """Shortcut for self.client.delete('/api/v1/' + endpoint)."""
        return self.client.delete(self.api_base + endpoint)

    def get(self, endpoint=''):
        """Shortcut for self.client.get('/api/v1/' + endpoint, format='json', content_type='application/json')."""
        return self.client.get(self.api_base + endpoint, format='json', content_type='application/json')

    def patch(self, endpoint='', data=''):
        """
            Shortcut for self.client.get(
                '/api/v1/' + endpoint,
                data=data,
                format='json',
                content_type='application/json').
        """
        return self.client.patch(self.api_base + endpoint,
                                 data=data,
                                 format='json',
                                 content_type='application/json')

    def post(self, endpoint='', data=''):
        """
        Shortcut for self.client.post(
                '/api/v1/' + endpoint,
                data=data,
                format='json',
                content_type='application/json').
        """
        return self.client.post(self.api_base + endpoint,
                                data=data,
                                format='json',
                                content_type='application/json')
