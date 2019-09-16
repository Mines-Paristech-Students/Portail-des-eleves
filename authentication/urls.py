from django.urls import path

from rest_framework_bulk.routes import BulkRouter

from authentication.views import CheckCredentials, JWTSetCookiesView, ProfileViewSet, LogoutView, get_birthdays, \
    ProfileAnswerViewSet, ProfileQuestionViewSet, get_profile_questions, get_promotions

router = BulkRouter()

router.register(r'users', ProfileViewSet)
router.register(r'profile_question', ProfileQuestionViewSet)
router.register(r'profile_answer', ProfileAnswerViewSet)

urlpatterns = [
    path('auth/', JWTSetCookiesView.as_view(), name='token_obtain_pair'),
    path('auth/check/', CheckCredentials.as_view(), name='check'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('birthdays/', get_birthdays, name="get_birthdays"),
    path('promotions/', get_promotions, name="get_promotions"),
    path('profile/questions/<user_pk>', get_profile_questions),
] + router.urls
