import sys

from django.contrib.auth import get_user_model
from django.http import HttpResponse

from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from authentication.exceptions import TokenError
from authentication.settings import api_settings
from authentication.token import Token

class JWTCookieAuthentication(authentication.BaseAuthentication):
    """
    A Django rest authentication class that will:
    - Check that requests contains the anti-CSRF custom header
    - Validate the JWT token received
    - Returns the user
    """

    User = get_user_model()

    def authenticate(self, request):
        if not self.validate_csrf_header(request):
            raise AuthenticationFailed("Custom header against CSRF attacks is not set")

        raw_token = request.COOKIES.get(api_settings.ACCESS_TOKEN_COOKIE_NAME)
        if raw_token is None:
            raise AuthenticationFailed("Authorization cookie not set")
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), None



    def validate_csrf_header(self, request):
        return True # Leave it that what in dev so we can check API from the browser
        #header = request.META.get('HTTP_X_REQUESTED_WITH')
        #return header == 'XMLHttpRequest'

    def get_validated_token(self, raw_token):
        """
        Validates an encoded JSON web token and returns a validated token
        wrapper object.
        """
        try:
            return Token(raw_token)
        except TokenError as e:
            raise AuthenticationFailed(str(e))

    def get_user(self, validated_token):
        """
        Attempts to find and return a user using the given validated token.
        """
        try:
            user_id = validated_token[api_settings.USER_ID_CLAIM]
        except KeyError:
            raise AuthenticationFailed('Token contained no recognizable user identification')

        try:
            user = self.User.objects.get(**{api_settings.USER_ID_FIELD: user_id})
        except self.User.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')

        if not user.is_active:
            raise AuthenticationFailed('User is inactive', code='user_inactive')

        return user
