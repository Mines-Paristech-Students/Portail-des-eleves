from datetime import datetime
from django.conf import settings
from django.shortcuts import redirect
import jwt
from rest_framework import views
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response

from authentication.token import decode_token
from authentication.authentication import JWTCookieAuthentication


class LoginView(views.APIView):
    """This view takes a JWT as a GET parameter, verifies it and sets it as a cookie."""

    authentication_classes = ()
    permission_classes = ()

    def get(self, request, format=None, *args, **kwargs):
        if settings.JWT_AUTH_SETTINGS["GET_PARAMETER"] in request.GET:
            # Retrieve the token.
            token = request.GET[settings.JWT_AUTH_SETTINGS["GET_PARAMETER"]]

            try:
                claims = decode_token(
                    token, verify=settings.JWT_AUTH_SETTINGS["VERIFY_SIGNATURE"]
                )
            except jwt.exceptions.InvalidTokenError as e:
                raise AuthenticationFailed(e) from e

            # Verify if the token can authenticate an user.
            JWTCookieAuthentication().get_user(claims)

            # Set it as a cookie.
            response = redirect(settings.PORTAIL_URL)
            response.set_cookie(
                key=settings.JWT_AUTH_SETTINGS["ACCESS_TOKEN_COOKIE_NAME"],
                value=token,
                expires=datetime.now()
                + settings.JWT_AUTH_SETTINGS["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                secure=not settings.DEBUG,
                domain=settings.PORTAIL_HOSTNAME,
            )

            return response

        raise AuthenticationFailed(
            f"Provide a JWT as the `{settings.JWT_AUTH_SETTINGS['GET_PARAMETER']}` GET parameter."
        )


class LogoutView(views.APIView):
    """This view removes the JWT token saved on the client browser."""

    authentication_classes = ()
    permission_classes = ()

    def get(self, request, format=None, *args, **kwargs):
        """Overwrite the JWT cookie with a dummy value and make it expire in the past so that most browser will
        delete the cookie."""

        response = Response("Cookie deleted.")
        response.delete_cookie(
            settings.JWT_AUTH_SETTINGS["ACCESS_TOKEN_COOKIE_NAME"],
            domain=settings.PORTAIL_HOSTNAME,
        )

        return response


class CredentialsView(views.APIView):
    """This view returns the credentials of the currently logged-in user."""

    def get(self, request, format=None, *args, **kwargs):
        return Response(
            {
                "user_id": request.user.id,
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "promotion": request.user.promotion,
                "is_staff": request.user.is_staff,
            }
        )


class JwtView(views.APIView):
    def get(self, request):
        return Response({"jwt_token": request.COOKIES["jwt_access"]})
