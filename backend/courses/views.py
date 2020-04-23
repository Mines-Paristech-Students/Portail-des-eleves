from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import IsAuthenticated

from courses.models import Course, Form, Question, Object
from courses.serializers import CourseSerializer, FormSerializer, QuestionSerializer, CommentSerializer
from courses.permissions import CoursePermission, FormPermission


class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    permission_classes = [FormPermission]


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [CoursePermission]

    def user_has_voted(self, user):
        course = self.get_object()
        if Course.object.filter(have_voted=user, id=course.id).exists():
            return Response("Should provide answers for all mandatory fields", status.HTTP_400_BAD_REQUEST)

    # Putting it here, as it doesn't need the FormSerializer itself
    @action(detail=True, methods=["POST"], permission_classes=[IsAuthenticated])
    def submit(self, request, pk=None):
        current_user = request.user
        self.user_has_voted(current_user)

        course = self.get_object()
        form = course.form

        ratings_data = request.data["ratings"]
        comments_data = request.data["comments"]

        if ratings_data:
            question_ids = [question["question"] for question in ratings_data]
            if Question.objects.filter(form=form).exclude(pk__in=question_ids, required=True).exists():
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