from datetime import datetime

from django.conf import settings
import jwt
from rest_framework.test import APITestCase

from backend.fake_private_key import FAKE_PRIVATE_KEY


class BaseTestCase(APITestCase):
    """
    This test base provides convenient `get`, `post`, etc. shortcut methods to the corresponding
    `self.client.xxx` methods.
    When using these methods, the URLs must be shortened from `/api/v1/some/endpoint/` to `/some/endpoint/`.
    """

    api_base = "/api/v1"

    def setUp(self):
        settings.JWT_AUTH_SETTINGS["VERIFY_SIGNATURE"] = True

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

    def get(self, url, data=None):
        return self.client.get(self.api_base + url, data)

    def post(self, url, data=None, format="json", files=None):
        return self.client.post(self.api_base + url, data, format=format)

    def patch(self, url, data=None, format="json"):
        return self.client.patch(self.api_base + url, data, format=format)

    def put(self, url, data=None, format="json"):
        return self.client.put(self.api_base + url, data, format=format)

    def delete(self, url):
        return self.client.delete(self.api_base + url)

    def head(self, url, data=None):
        return self.client.head(self.api_base + url, data)

    def options(self, url, data=None):
        return self.client.options(self.api_base + url, data)


class WeakAuthenticationBaseTestCase(BaseTestCase):
    """
    This test base provides convenient methods to log users in and out.
    However, it does so by generating fake JWT and disabling the signature verification.
    Do not use this test base to test the JWT authentication itself.

    If you overload `setUp` in a child class, do not forget to call the base setUp too!
    """

    def setUp(self):
        settings.JWT_AUTH_SETTINGS["VERIFY_SIGNATURE"] = False

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

    def login(self, username):
        """
        Log an user in.
        :param str username: the user's username.
        :return: the response from token_obtain_pair.
        """

        self.logout()

        fake_jwt = self._get_fake_jwt(username)

        url = f"/auth/login/?{settings.JWT_AUTH_SETTINGS['GET_PARAMETER']}={fake_jwt}"
        return self.get(url)

    def logout(self):
        """Log the current user out."""
        self.client.logout()
