from django.urls import path

from rest_framework_bulk.routes import BulkRouter

from authentication.views import (
    ProfileViewSet,
    LoginView,
    LogoutView,
    CredentialsView,
    get_birthdays,
    ProfileAnswerViewSet,
    ProfileQuestionViewSet,
    list_profile_questions,
    list_promotions,
)

router = BulkRouter()

router.register(r"users/users", ProfileViewSet)
router.register(r"users/profile_question", ProfileQuestionViewSet)
router.register(r"users/profile_answer", ProfileAnswerViewSet)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/check/", CredentialsView.as_view(), name="check-credentials"),
    path("users/birthdays/<int:number_of_days>/", get_birthdays, name="get_birthdays"),
    path("users/promotions/", list_promotions, name="list_promotions"),
    path("users/questions/<slug:user_pk>/", list_profile_questions),
] + router.urls
