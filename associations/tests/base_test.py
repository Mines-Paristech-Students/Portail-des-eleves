from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient


class BaseTestCase(TestCase):
    client = APIClient(enforce_csrf_checks=True)

    api_base = '/api/v1'

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

    def get(self, url, data=None):
        return self.client.get(self.api_base + url, data)

    def post(self, url, data=None, format='json', content_type='application/json'):
        return self.client.post(self.api_base + url, data, format=format, content_type=content_type)

    def patch(self, url, data=None, format='json', content_type='application/json'):
        return self.client.patch(self.api_base + url, data, format=format, content_type=content_type)

    def delete(self, url, data=None, format='json', content_type='application/json'):
        return self.client.delete(self.api_base + url, data, format=format, content_type=content_type)

    def head(self, url, data=None):
        return self.client.head(self.api_base + url, data)

    def options(self, url, data=None):
        return self.client.options(self.api_base + url, data)
