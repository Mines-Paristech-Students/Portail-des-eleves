from django.urls import path

from rest_framework_bulk.routes import BulkRouter

from authentication.views import (
    ProfileViewSet,
    LoginView,
    LogoutView,
    get_birthdays,
    ProfileAnswerViewSet,
    ProfileQuestionViewSet,
    list_profile_questions,
    list_promotions,
)

router = BulkRouter()

router.register(r"users", ProfileViewSet)
router.register(r"profile_question", ProfileQuestionViewSet)
router.register(r"profile_answer", ProfileAnswerViewSet)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("birthdays/<int:number_of_days>/", get_birthdays, name="get_birthdays"),
    path("promotions/", list_promotions, name="list_promotions"),
    path("users/questions/<slug:user_pk>/", list_profile_questions),
] + router.urls
