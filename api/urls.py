from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from authentication import views
from authentication.views import CheckCredentials, JWTSetCookiesView

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    path('auth/', JWTSetCookiesView.as_view(), name='token_obtain_pair'),
    path('auth/check/', CheckCredentials.as_view(), name='check'),
    url('rest/', include(router.urls))
]
