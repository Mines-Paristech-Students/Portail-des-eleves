from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from authentication.views import CheckCredentials, JWTSetCookiesView, UserViewSet
from associations.views import AssociationViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'associations', AssociationViewSet)

urlpatterns = [
    path('auth/', JWTSetCookiesView.as_view(), name='token_obtain_pair'),
    path('auth/check/', CheckCredentials.as_view(), name='check'),
    url('rest/', include(router.urls))
]
