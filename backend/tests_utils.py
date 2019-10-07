from datetime import datetime

from django.conf import settings
from django.test import TestCase
from django.urls import reverse
import jwt
from rest_framework.test import APIClient

from associations.models import User
from backend.fake_private_key import FAKE_PRIVATE_KEY


class WeakAuthenticationBaseTestCase(TestCase):
    """
        This test base provides convenient methods to log users in and out.
        However, it does so by generating fake JWT and disabling the signature verification.
        Do not use this test base to test the JWT authentication itself.
    """

    client = APIClient(enforce_csrf_checks=True)

    api_base = "/api/v1"

    def setUp(self):
        settings.JWT_AUTH_SETTINGS["VERIFY_SIGNATURE"] = False

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

    def _get_fake_jwt(self, username):
        """
            Produce a fake JWT authenticating the given user.
            Use a random RSA private key.
        """

        payload = {
            "exp": int(datetime(2100, 1, 1).timestamp()),
            "iss": settings.JWT_AUTH_SETTINGS["ISSUER"],
            "aud": "portail",
            "jti": "ec1901b49bae43f8b3e90782b0c8b131",
            settings.JWT_AUTH_SETTINGS["USER_ID_CLAIM_NAME"]: username,
        }

        return jwt.encode(
            payload=payload,
            key=FAKE_PRIVATE_KEY,
            algorithm=settings.JWT_AUTH_SETTINGS["ALGORITHM"],
        ).decode(
            "utf-8"
        )  # jwt.encode returns a bytes object, it thus has to be decoded to a str.

    def login(self, username, password="password"):
        """
        Log an user in.
        :param str username: the user's username.
        :param str password: the user's password (default: password, should not change)
        :return: the response from token_obtain_pair.
        """

        self.logout()

        fake_jwt = self._get_fake_jwt(username)

        url = f"{reverse('login')}?{settings.JWT_AUTH_SETTINGS['GET_PARAMETER']}={fake_jwt}"
        return self.client.get(url, format="json")

    def create_user(self, username="user", admin=False):
        """
        Create an user, with password='password'

        :param str username: the user's id.
        :param bool admin: if True, the user will be an admin; otherwise, it will be a simple user.
        :return: the created User object.
        """

        password = "password"

        if admin:
            return User.objects.create_superuser(
                username,
                f"Admin_{username}",
                "User",
                f"admin_{username}@mines-paristech.fr",
                password,
                "2018-06-06",
                2018,
            )
        else:
            return User.objects.create_user(
                username,
                f"Simple_{username}",
                "User",
                f"simple_{username}@mines-paristech.fr",
                password,
                "2018-06-06",
                2018,
            )

    def create_and_login_user(self, username="user", admin=False):
        """
        Create a dummy user with the specified rights, log it in and create the JWT token.

        :param str username: the user's id.
        :param bool admin: if True, the user will be an admin; otherwise, it will be a simple user.
        :return: the created user
        """

        user = self.create_user(username, admin)
        self.login(username, "password")
        return user

    def get(self, url, data=None):
        return self.client.get(self.api_base + url, data)

    def post(self, url, data=None, format="json", content_type="application/json"):
        return self.client.post(
            self.api_base + url, data, format=format, content_type=content_type
        )

    def patch(self, url, data=None, format="json", content_type="application/json"):
        return self.client.patch(
            self.api_base + url, data, format=format, content_type=content_type
        )

    def put(self, url, data=None, format="json", content_type="application/json"):
        return self.client.put(
            self.api_base + url, data, format=format, content_type=content_type
        )

    def delete(self, url, data="", format=None, content_type=None):
        return self.client.delete(self.api_base + url)

    def head(self, url, data=None):
        return self.client.head(self.api_base + url, data)

    def options(self, url, data=None):
        return self.client.options(self.api_base + url, data)
