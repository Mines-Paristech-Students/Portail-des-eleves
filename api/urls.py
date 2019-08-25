from django.conf.urls import url, include
from django.urls import path
from rest_framework_bulk.routes import BulkRouter

import polls.urls
import polls.urls
import repartitions.urls
import subscriptions.urls
import subscriptions.urls
from associations.views import AssociationViewSet, PageViewSet, NewsViewSet, MarketplaceViewSet, \
    ProductViewSet, OrderViewSet, LibraryViewSet, FundingViewSet, BalanceView, LoansViewSet, \
    LoanableViewSet
from associations.views import RoleViewSet
from associations.views.filesystem import FileViewSet, FolderViewSet, FileSystemView
from authentication.views import CheckCredentials, JWTSetCookiesView, UserViewSet, LogoutView, get_birthdays, \
    ProfileAnswerViewSet, ProfileQuestionViewSet, get_profile_questions
from authentication.views import get_promotions
from chat.views import ChatMessageViewSet
from forum.views import ThemeViewSet, TopicViewSet, MessageForumViewSet, NewVoteMessageView
from rer.views import get_rer_timetable

router = BulkRouter()

router.register(r'users', UserViewSet)
router.register(r'chat', ChatMessageViewSet) # Adds classic REST endpoint + retrieve_up_to + retrieve_from

# Association
router.register(r'associations', AssociationViewSet)
router.register(r'pages', PageViewSet)
router.register(r'news', NewsViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'marketplace', MarketplaceViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'library', LibraryViewSet)
router.register(r'loans', LoansViewSet)
router.register(r'loanables', LoanableViewSet)
router.register(r'funding', FundingViewSet)
router.register(r'file', FileViewSet)
router.register(r'folder', FolderViewSet)

# Forum
router.register(r'forum', ThemeViewSet)
router.register(r'theme', TopicViewSet)
router.register(r'topic', MessageForumViewSet)

# Profile
router.register(r'profile_question', ProfileQuestionViewSet)
router.register(r'profile_answer', ProfileAnswerViewSet)

urlpatterns = [
    path('auth/', JWTSetCookiesView.as_view(), name='token_obtain_pair'),
    path('auth/check/', CheckCredentials.as_view(), name='check'),
    path('polls/', include(polls.urls)),
    url(r'^associations/(?P<association_id>[^/.]+)/filesystem/root$', FileSystemView.as_view()),
    url(r'^marketplace/(?P<marketplace_id>[^/.]+)/balance/(?P<user_id>[^/.]*)$', BalanceView.as_view()),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('birthdays/', get_birthdays, name="get_birthdays"),
    path('subscriptions/', include(subscriptions.urls)),
    path('repartitions/', include(repartitions.urls)),
    url(r'^message-forum-vote/$', NewVoteMessageView.as_view()),
    path('promotions/', get_promotions, name="get_promotions"),
    path('rer/', get_rer_timetable, name="get_rer_timetable"),
    path('subscriptions/', include(subscriptions.urls)),
    path('profile/questions/<user_pk>', get_profile_questions)
] + router.urls
