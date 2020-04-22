from rest_framework import generics
from rest_framework import viewsets

from courses.models import Course
from courses.serializers import CourseSerializer
from courses.permissions import CoursePermission


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CoursePermission]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)