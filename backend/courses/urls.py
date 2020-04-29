from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses import views

router = DefaultRouter()

router.register(r'courses', views.CourseViewSet)

router.register(r'forms', views.FormViewSet, basename="courses")

router.register(r'questions', views.QuestionViewSet, basename="courses")

router.register(r'ratings', views.RatingViewSet, basename="ratings")

urlpatterns = [
    path('', include(router.urls)),
]