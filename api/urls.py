from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers

from authentication.views import CheckCredentials, JWTSetCookiesView, UserViewSet
from associations.views import AssociationViewSet, PageViewSet, NewsViewSet, GroupViewSet, MarketplaceViewSet, \
    LibraryViewSet, OrderViewSet, ProductViewSet, BalanceView, FundingViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'associations', AssociationViewSet)
router.register(r'pages', PageViewSet)
router.register(r'news', NewsViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'marketplace', MarketplaceViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'library', LibraryViewSet)
router.register(r'funding', FundingViewSet)

urlpatterns = [
    path('auth/', JWTSetCookiesView.as_view(), name='token_obtain_pair'),
    path('auth/check/', CheckCredentials.as_view(), name='check'),
    url('rest/', include(router.urls)),
    url(r'^rest/marketplace/(?P<pk>[^/.]+)/balance$', BalanceView.as_view()),
]
