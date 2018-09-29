from django.conf.urls import url
from django.urls import path
from rest_framework import routers

from associations.views import AssociationViewSet, PageViewSet, NewsViewSet, GroupViewSet, MarketplaceViewSet, \
    ProductViewSet, OrderViewSet, LibraryViewSet, FundingViewSet, BalanceView
from authentication.views import UserViewSet, JWTSetCookiesView, CheckCredentials, LogoutView

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
    url(r'^marketplace/(?P<marketplace_id>[^/.]+)/balance/(?P<user_id>[^/.]*)$', BalanceView.as_view()),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
] + router.urls
