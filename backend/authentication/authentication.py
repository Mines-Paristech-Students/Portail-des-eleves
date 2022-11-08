import jwt
from authentication import utils
from authentication.token import decode_token
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from backend import settings


class JWTCookieAuthentication(authentication.BaseAuthentication):
    """
    A Django rest authentication class that will:
    - Check that `request` contains the anti-CSRF custom header.
    - Validate the JWT token received.
    - Return the user.
    """

    User = get_user_model()

    def authenticate(self, request: HttpRequest):
        try:
            # Validate the CSRF header.
            if not self.validate_csrf_header(request):
                raise AuthenticationFailed(
                    "Custom header against CSRF attacks is not set."
                )

            # Get the cookie.
            raw_token = request.COOKIES.get(
                settings.JWT_AUTH_SETTINGS["ACCESS_TOKEN_COOKIE_NAME"]
            )
            if raw_token is None:
                raise AuthenticationFailed("Authorization cookie not set.")

            # Decode and verify the token.
            # In DEBUG, the token is not verified (this allows to run tests more easily).
            try:
                claims = decode_token(
                    raw_token, verify=settings.JWT_AUTH_SETTINGS["VERIFY_SIGNATURE"]
                )
            except jwt.exceptions.InvalidTokenError as e:
                raise AuthenticationFailed(e)
        except AuthenticationFailed as e:
            if (
                utils.get_hostname(request)
                in settings.ALLOWED_BYPASS_AUTHENTICATION_HOSTS
            ):
                return None, None
            raise e

        # Authenticate the user.
        return self.get_user(claims), None

    def authenticate_header(self, request):
        """Implementing this method is required for returning a 401 status code if authentication is wrong."""
        return "Custom authentication method."

    def validate_csrf_header(self, request):
        if not settings.is_prod_mode():
            # Leave it like that in dev so we can check the API from the browser.
            return True
        header = request.META.get("HTTP_X_REQUESTED_WITH")
        return header == "XMLHttpRequest"

    def get_user(self, validated_token):
        """Attempt to find and return a user using the given validated token."""

        try:
            user_id = validated_token[settings.JWT_AUTH_SETTINGS["USER_ID_CLAIM_NAME"]]
        except KeyError:
            raise AuthenticationFailed(
                "Token contained no recognizable user identification."
            )

        try:
            user = self.User.objects.get(pk=user_id)
        except self.User.DoesNotExist:
            raise AuthenticationFailed("User not found.", code="user_not_found")

        if not user.is_active:
            raise AuthenticationFailed("User is inactive.", code="user_inactive")

        return user
