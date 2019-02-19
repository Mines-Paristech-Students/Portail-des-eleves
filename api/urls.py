from django.conf.urls import url, include
from django.urls import path
from rest_framework import routers

from associations.views.filesystem import FileViewSet, FolderViewSet, FileSystemView
from authentication.views import CheckCredentials, JWTSetCookiesView, UserViewSet, LogoutView, get_birthdays
from associations.views import AssociationViewSet, PageViewSet, NewsViewSet, GroupViewSet, MarketplaceViewSet, \
    ProductViewSet, OrderViewSet, LibraryViewSet, FundingViewSet, BalanceView
from chat.views import ChatMessageViewSet
from forum.views import ThemeViewSet, TopicViewSet, MessageForumViewSet
import polls.urls
import subscriptions.urls

router = routers.DefaultRouter()

router.register(r'users', UserViewSet)
router.register(r'chat', ChatMessageViewSet) # Adds classic REST endpoint + retrieve_up_to + retrieve_from

# Association
router.register(r'associations', AssociationViewSet)
router.register(r'pages', PageViewSet)
router.register(r'news', NewsViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'marketplace', MarketplaceViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'library', LibraryViewSet)
router.register(r'funding', FundingViewSet)
router.register(r'file', FileViewSet)
router.register(r'folder', FolderViewSet)

# Forum
router.register(r'forum', ThemeViewSet)
router.register(r'theme', TopicViewSet)
router.register(r'topic', MessageForumViewSet)

urlpatterns = [
    path('auth/', JWTSetCookiesView.as_view(), name='token_obtain_pair'),
    path('auth/check/', CheckCredentials.as_view(), name='check'),
    path('polls/', include(polls.urls)),
    url(r'^associations/(?P<association_id>[^/.]+)/filesystem/root$', FileSystemView.as_view()),
    url(r'^marketplace/(?P<marketplace_id>[^/.]+)/balance/(?P<user_id>[^/.]*)$', BalanceView.as_view()),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('birthdays/', get_birthdays, name="get_birthdays"),
    path('birthdays/<int:days>/', get_birthdays, name="get_birthdays"),
    path('subscriptions/', include(subscriptions.urls))
] + router.urls
