from django.http import HttpResponse, JsonResponse
from django.core.paginator import Paginator

from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import viewsets, generics
from rest_framework import pagination

from courses.models import Course, Form, Question, Comment, Rating
from courses.serializers import CourseSerializer, FormSerializer, QuestionSerializer, CommentSerializer, RatingSerializer
from courses.permissions import CoursePermission, FormPermission


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CoursePermission]

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def stats(self, request, pk=None):
        course = self.get_object()
        return Response(course.stats, status.HTTP_200_OK)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def has_voted(self, request, pk=None):
        current_user = request.user
        course = self.get_object()

        has_voted = Course.objects.filter(id=course.id, have_voted=current_user).exists()

        return JsonResponse({"has_voted": has_voted}, safe=False)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        """Defined outside CourseViewSet to simplify permissions"""
        data = request.data
        current_user = request.user
        course = self.get_object()

        if Course.objects.filter(have_voted=current_user, id=course_pk).exists():
            return Response("Has already voted!", status.HTTP_405_METHOD_NOT_ALLOWED)

        # Check course ID
        form = course.form
        if not form:
            return Response("Selected course doesn't have any associated form", status.HTTP_400_BAD_REQUEST)

        ratings_data = request.data.get("ratings")
        comments_data = request.data.get("comments")

        # Check fields are correct
        ratings_questions, comments_questions = [], []
        try:
            if ratings_data:
                for rating in ratings_data:
                    ratings_questions.append(rating["question"])
                    rating["course"] = course_pk
            if comments_data:
                for comment in comments_data:
                    comments_questions.append(comment["question"])
                    comment["course"] = course_pk
        except KeyError:
            return Response("Missing question id", status.HTTP_400_BAD_REQUEST)

        if Question.objects.filter(form=form)\
            .exclude(pk__in=ratings_questions+comments_questions) \
            .exclude(required=False)\
                .exists():
            return Response("Missing required fields", status.HTTP_400_BAD_REQUEST)

        if Question.objects.filter(form=form)\
            .filter(pk__in=ratings_questions+comments_questions, archived=True)\
                .exists():
            return Response("Cannot submit archived questions", status.HTTP_400_BAD_REQUEST)

        ratings_serializer = RatingSerializer(data=ratings_data, many=True)
        if not ratings_serializer.is_valid():
            return Response(ratings_serializer.errors, status.HTTP_400_BAD_REQUEST)

        comments_serializer = CommentSerializer(data=comments_data, many=True)
        if not comments_serializer.is_valid():
            return Response(comments_serializer.errors, status.HTTP_400_BAD_REQUEST)

        course.have_voted.add(current_user)
        course.save()

        comments_serializer.save()
        ratings_serializer.save()

        return Response(f"User {current_user.id} has voted", status.HTTP_201_CREATED)


class CommentPagination(pagination.PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100


class CommentsPaginatedList(generics.ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

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
            .filter(achived=false)\
            filter(**filter_params)\
            .order_by('date').reverse()
