from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.views import views
from courses.views.CourseViews import CourseViewSet

router = DefaultRouter()

router.register(r'courses', CourseViewSet)

router.register(r'forms', views.FormViewSet)

router.register(r'questions', views.QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]