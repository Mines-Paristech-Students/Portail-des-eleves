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
from rest_framework.decorators import action, api_view, permission_classes 

from courses.models import Course, Form, Question, Comment, Rating
from courses.serializers import CourseSerializer, FormSerializer, QuestionSerializer, CommentSerializer, RatingSerializer
from courses.permissions import CoursePermission, FormPermission


class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    permission_classes = [FormPermission]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [FormPermission]

    @action(detail=True, methods=['get'])
    def result(self, request, pk=None):
        question = self.get_object()
        return Response(data={'plop': question.average}, status=status.HTTP_200_OK)

    # TODO
    # 1. List for a form


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CoursePermission]

    # Putting it here, as it doesn't need the FormSerializer itself

    # We will need to cache this in the future
    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def avg_ratings(self, request, pk=None):
        course = self.get_object()
        return Response(course.avg_ratings, status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit(request):
    """Defined outside CourseViewSet to simplify permissions"""
    data = request.data
    current_user = request.user

    course_id = data.pop("course")
    if not course_id:
        return Response("Has already voted!", status.HTTP_400_BAD_REQUEST)

    if Course.objects.filter(have_voted=current_user, id=data["course"]).exists():
        return Response("Has already voted!", status.HTTP_405_METHOD_NOT_ALLOWED)

    # Check course ID
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
