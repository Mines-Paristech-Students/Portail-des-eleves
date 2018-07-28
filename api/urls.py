from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from authentication import views
from authentication.views import CheckCredentials, JWTSetCookiesView, CurrentUser

router = routers.DefaultRouter()
router.register(r'students', views.StudentViewSet)

urlpatterns = [
    path('auth/', JWTSetCookiesView.as_view(), name='token_obtain_pair'),
    path('auth/check/', CheckCredentials.as_view(), name='check'),
    path('auth/current_user/', CurrentUser.as_view(), name='get_current_user'),
    url('rest/', include(router.urls))
]
