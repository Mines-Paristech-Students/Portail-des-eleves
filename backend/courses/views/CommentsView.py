import django_filters

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics
from rest_framework import pagination

from courses.models import Course, Form, Question, Comment, Rating
from courses.serializers import CommentSerializer
from courses.permissions import FormPermission


class CommentPagination(pagination.PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 100


class CommentFilter(django_filters.FilterSet):
    class Meta:
        model = Comment
        fields = ["question__id", "course__id", "date"]


class CommentsPaginatedList(generics.ListAPIView):
    queryset = Comment.objects.all()
    filterset_class = CommentFilter
    serializer_class = CommentSerializer
    pagination_class = CommentPagination
    permission_classes = [IsAuthenticated]
