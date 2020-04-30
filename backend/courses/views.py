from django.utils.functional import cached_property
from django.db.models import Avg
from django.core import serializers
from django.http import HttpResponse


from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action

from courses.models import Course, Form, Question, Comment, Rating
from courses.serializers import CourseSerializer, FormSerializer, QuestionSerializer, CommentSerializer, RatingSerializer
from courses.permissions import CoursePermission, FormPermission


class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer 
    permission_classes = [FormPermission]


class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    permission_classes = [FormPermission]

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def update_with_questions(self, request, pk=None):
        pass


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [FormPermission]

    @action(detail=True, methods=['get'])
    def result(self, request, pk=None):
        question = self.get_object()
        return Response(data={'plop': question.average}, status=status.HTTP_200_OK)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CoursePermission]

    # Putting it here, as it doesn't need the FormSerializer itself
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        current_user = request.user
        if Course.object.filter(have_voted=user, id=course.id).exists():
            return Response("Should provide answers for all mandatory fields", status.HTTP_400_BAD_REQUEST)

        course = self.get_object()
        form = course.form

        ratings_data = request.data["ratings"]
        comments_data = request.data["comments"]

        if ratings_data:
            question_ids = [question["question"] for question in ratings_data]
            if Rating.objects.filter(form=form).exclude(pk__in=question_ids, required=True).exists():
                return Response("Should provide answers for all mandatory fields", status.HTTP_400_BAD_REQUEST)

            ratings_serializer = QuestionSerializer(ratings_data, many=True)
            if not ratings_serializer.is_valid():
                return Response(ratings_serializer.errors, status.HTTP_400_BAD_REQUEST)

        if comments_data:
            question_ids = [comment["question"] for comment in comments_data]
            if Comment.objects.filter(form=form).exclude(pk__in=question_ids, required=True).exists():
                return Response("Should provide answers for all mandatory fields", status.HTTP_400_BAD_REQUEST)

            comments_serializer = CommentSerializer(comments_data, many=True)
            if not comments_serializer.is_valid():
                return Response(comments_serializer.errors, status.HTTP_400_BAD_REQUEST)

        comments_serializer.save()
        ratings_serializer.save()

        return Response(status.HTTP_201_CREATED)

    # We will need to cache this in the future
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def avg_ratings(self, request, pk=None):
        course = self.get_object()
        return Response(course.avg_ratings, status.HTTP_200_OK) 