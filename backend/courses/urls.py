from courses.views import CourseViewSet
from django.urls import path

from rest_framework_bulk.routes import BulkRouter

router = BulkRouter()
urlpatterns = []

router.register(f"courses", CourseViewSet)

urlpatterns += router.urls