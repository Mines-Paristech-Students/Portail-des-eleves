from datetime import datetime
from django.conf import settings
import jwt
from rest_framework import status, views
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response

from authentication.token import decode_token


class LoginView(views.APIView):
    """This view takes a JWT as a GET parameter, verifies it and sets it as a cookie."""

    authentication_classes = ()
    permission_classes = ()

    def get(self, request, format=None, *args, **kwargs):
        if settings.JWT_AUTH_SETTINGS["GET_PARAMETER"] in request.GET:
            # Retrieve the token.
            token = request.GET.get(settings.JWT_AUTH_SETTINGS["GET_PARAMETER"])

            try:
                decode_token(
                    token, verify=settings.JWT_AUTH_SETTINGS["VERIFY_SIGNATURE"]
                )
            except jwt.exceptions.InvalidTokenError as e:
                raise AuthenticationFailed(e)

            # Set it as a cookie.
            response = Response({"token": token}, status=status.HTTP_200_OK)
            response.set_cookie(
                key=settings.JWT_AUTH_SETTINGS["ACCESS_TOKEN_COOKIE_NAME"],
                value=token,
                expires=datetime.now()
                + settings.JWT_AUTH_SETTINGS["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                secure=not settings.DEBUG,
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
        response.delete_cookie(settings.JWT_AUTH_SETTINGS["ACCESS_TOKEN_COOKIE_NAME"])

        return response
