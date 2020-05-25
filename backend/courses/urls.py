from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses import views

router = DefaultRouter()

router.register(r'courses', views.CourseViewSet)

router.register(r'forms', views.FormViewSet)

router.register(r'questions', views.QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("courses/<course_pk>/questions", views.list_course_questions),
    path("courses/<course_pk>/submit", views.submit),
    path("courses/<course_pk>/has_voted", views.has_voted),
]