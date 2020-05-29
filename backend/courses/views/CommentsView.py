from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics
from rest_framework import pagination

from courses.models import Course, Form, Question, Comment, Rating
from courses.serializers import CommentSerializer
from courses.permissions import FormPermission


class CommentPagination(pagination.PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class CommentsPaginatedList(generics.ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentPagination
    permission_classes = [IsAuthenticated]

    mapping_params = {
        "course": "course__id",
        "question": "question__id",
        "date": "date",
    }

    @classmethod
    def set_query_params_if_not_none(cls, query_params):
        filter_params = {}

        for key, query_key in cls.mapping_params.items():
            value = query_params.get(key, None)

            if value is not None:
                filter_params[query_key] = value

        return filter_params

    def get_queryset(self):
        filter_params = self.set_query_params_if_not_none(self.request.query_params)
        queryset = Comment.objects.all()

        return queryset.\
            filter(question__archived=False).\
            filter(**filter_params)\
            .order_by('date').reverse()
