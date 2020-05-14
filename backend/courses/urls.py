from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses import views

router = DefaultRouter()

router.register(r'', views.CourseViewSet)

router.register(r'forms', views.FormViewSet)

router.register(r'questions', views.QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("<course_pk>/questions", views.list_course_questions),
    path("<course_pk>/submit", views.submit),
]