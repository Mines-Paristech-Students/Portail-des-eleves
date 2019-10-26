from django.urls import reverse

from rest_framework.test import APITestCase

from authentication.models import User


class BackendTestCase(APITestCase):
    """Define some helpful functions for testing the backend applications."""

    api_base = "/api/v1/"

    def create_user(self, id="user", admin=False):
        """
        Create an user, with password='password'

        :param str id: the user's id.
        :param bool admin: if True, the user will be an admin; otherwise, it will be a simple user.
        :return: the created User object.
        """
        password = "password"

        if admin:
            return User.objects.create_superuser(
                id,
                "Admin_" + str(id),
                "User",
                "admin_" + str(id) + "@mines-paristech.fr",
                password,
                "2018-06-06",
                18,
            )
        else:
            return User.objects.create_user(
                id,
                "Simple_" + str(id),
                "User",
                "simple_" + str(id) + "@mines-paristech.fr",
                password,
                "2018-06-06",
                18,
            )

    def logout(self):
        """Log the current user out."""
        self.client.logout()

    def login(self, id, password="password"):
        """
        Log an user in.

        :param str id: the user's id.
        :param str password: the user's password (default: password, should not change)
        :return: the response from token_obtain_pair.
        """

        self.logout()

        url = reverse("token_obtain_pair")
        data = {"id": id, "password": password}
        response = self.client.post(url, data, format="json")
        self.client.cookies = response.cookies

        return response

    def create_and_login_user(self, id="user", admin=False):
        """
        Create a dummy user with the specified rights, log it in and create the JWT token.

        :param str id: the user's id.
        :param bool admin: if True, the user will be an admin; otherwise, it will be a simple user.
        :return: the created user
        """

        user = self.create_user(id, admin)
        self.login(id, "password")
        return user

    def assertStatusCode(self, res, status_code, user_msg=""):
        msg = ""
        if hasattr(res, "url"):
            msg += f"URL: {res.url}\n"
        if hasattr(res, "content"):
            msg += f"Content: {res.content}\n"

        msg += f"\n{user_msg}"

        self.assertEqual(res.status_code, status_code, msg=msg)

    def assertStatusCodeIn(self, res, status_codes, user_msg=""):
        msg = ""
        if hasattr(res, "url"):
            msg += f"URL: {res.url}\n"
        if hasattr(res, "content"):
            msg += f"Content: {res.content}\n"

        msg += f"\n{user_msg}"

        self.assertIn(res.status_code, status_codes, msg=msg)

    def logout(self):
        """Log the current user out."""
        self.client.logout()

    def login(self, username, password="password"):
        """
        Log an user in.
        :param str username: the user's username.
        :param str password: the user's password (default: password, should not change)
        :return: the response from token_obtain_pair.
        """

        self.logout()

        url = reverse("token_obtain_pair")
        data = {"id": username, "password": password}
        return self.client.post(url, data, format="json")

    def get(self, url, data=None):
        return self.client.get(self.api_base + url, data)

    def post(self, url, data=None, format="json"):
        return self.client.post(self.api_base + url, data, format=format)

    def patch(self, url, data=None, format="json"):
        return self.client.patch(self.api_base + url, data, format=format)

    def delete(self, url, data="", format=None):
        return self.client.delete(self.api_base + url)

    def head(self, url, data=None):
        return self.client.head(self.api_base + url, data)

    def options(self, url, data=None):
        return self.client.options(self.api_base + url, data)
