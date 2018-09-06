from datetime import datetime

from django_filters.rest_framework import filters
from rest_framework import generics, status, viewsets
from django.http import HttpResponse
from rest_framework.filters import SearchFilter
from rest_framework.response import Response

from authentication.authentication import JWTCookieAuthentication
from authentication.models import User
from authentication.serializers import TokenSerializer, UserSerializer
from authentication.settings import api_settings
from backend import settings


class JWTSetCookiesView(generics.GenericAPIView):
    """
    This class gets creates a JWT token and sets it as a cookie
    """
    is_prod_mode = settings.is_prod_mode()
    serializer_class = TokenSerializer
    permission_classes = ()
    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        access_token = data['access']
        access_token_expiration = (datetime.now() + api_settings.ACCESS_TOKEN_LONG_LIFETIME)
        response = HttpResponse(status=status.HTTP_200_OK)
        response.set_cookie(
            api_settings.ACCESS_TOKEN_COOKIE_NAME,
            access_token,
            expires=access_token_expiration,
            httponly=True,
            secure=self.is_prod_mode,
        )
        return response


class LogoutView(generics.GenericAPIView):
    """
    This class removes the JWT token saved on the client browser
    """
    is_prod_mode = settings.is_prod_mode()

    def post(self, request, *args, **kwargs):
        """Overwrites the jwt cookie with a dummy value
        and makes it expire in the past so that most browser will
        delete the cookie
        """

        response = HttpResponse(status=status.HTTP_200_OK)
        response.set_cookie(
            api_settings.ACCESS_TOKEN_COOKIE_NAME,
            "deleted because you logged out",
            expires=datetime.fromtimestamp(0),
            httponly=True,
            secure=self.is_prod_mode,
        )
        return response


class CheckCredentials(generics.GenericAPIView):
    """
    This class gets both JWT tokens and sets them as secure cookies.
    """
    is_prod_mode = settings.is_prod_mode()
    authentication_classes = [JWTCookieAuthentication]

    def post(self, request, *args, **kwargs):
        return Response(
            {"id": request.user.id, "first_name": request.user.first_name, "last_name": request.user.last_name},
            status=status.HTTP_200_OK)



class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    filter_backends = (SearchFilter,)
    search_fields = ('id', 'first_name')

    def get_object(self):
        """
        This method is called by the view set to retrieve
        data for a given user. The user identifier is in the pk kwargs.

        If pk is the string "current", we return the data for the current
        authenticated user.
        """
        pk = self.kwargs.get('pk')
        if pk == "current":
            return self.request.user

        return super(UserViewSet, self).get_object()
