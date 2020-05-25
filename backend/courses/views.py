from django.utils.functional import cached_property
from django.db.models import Avg
from django.core import serializers
from django.http import HttpResponse, JsonResponse
from django.core.exceptions import ObjectDoesNotExist

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
    def stats(self, request, pk=None):
        course = self.get_object()
        return Response(course.stats, status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit(request, course_pk):
    """Defined outside CourseViewSet to simplify permissions"""
    data = request.data
    current_user = request.user

    if Course.objects.filter(have_voted=current_user, id=course_pk).exists():
        return Response("Has already voted!", status.HTTP_405_METHOD_NOT_ALLOWED)

    course = Course.objects.get(id=course_pk)

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_course_questions(request, course_pk):
    try:
        course = Course.objects.get(id=course_pk)
    except ObjectDoesNotExist:
        return Response(f"Course with id: {course_pk} does not exist", status.HTTP_400_BAD_REQUEST)

    form = course.form;
    if not form:
        return Response(f"Course with name {course.name} is not binded to any form", status.HTTP_400_BAD_REQUEST)

    questions = Question.objects.filter(form__course__id=course_pk).all()

    serializer = QuestionSerializer(questions, many=True)

    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def has_voted(request, course_pk):
    current_user = request.user
    has_voted = Course.objects.filter(id=course_pk, have_voted=current_user).exists()
    
    return JsonResponse({"has_voted": has_voted}, safe=False)