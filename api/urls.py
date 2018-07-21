from django.http import HttpResponse
from django.urls import path
from rest_framework.exceptions import AuthenticationFailed

from authentication.views import CheckCredentials, JWTSetCookiesView

urlpatterns = [
    path('auth/', JWTSetCookiesView.as_view(), name='token_obtain_pair'),
    path('auth/check/', CheckCredentials.as_view(), name='check')
]
