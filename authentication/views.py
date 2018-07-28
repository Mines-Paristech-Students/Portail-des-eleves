from datetime import datetime

from rest_framework import generics, status, viewsets
from rest_framework.response import Response

from authentication.authentication import JWTCookieAuthentication
from authentication.models import Student
from authentication.serializers import TokenSerializer, StudentSerializer
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
        access_token_expiration = (datetime.now() + api_settings.ACCESS_TOKEN_LIFETIME)
        response = Response(status=status.HTTP_200_OK)
        response.set_cookie(
            api_settings.ACCESS_TOKEN_COOKIE_NAME,
            access_token,
            expires=access_token_expiration,
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
        return Response({"pseudo": request.user.pseudo, "first_name": request.user.first_name, "last_name": request.user.last_name}, status=status.HTTP_200_OK)


class CurrentUser(generics.GenericAPIView):
    """
    This class gets both JWT tokens and sets them as secure cookies.
    """
    is_prod_mode = settings.is_prod_mode()
    authentication_classes = [JWTCookieAuthentication]

    def get(self, request, *args, **kwargs):
        user = Student.objects.get(pseudo=request.user)
        serialized_user = StudentSerializer(user)
        return Response(serialized_user.data, status=status.HTTP_200_OK)


class StudentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows students to be viewed or edited.
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
