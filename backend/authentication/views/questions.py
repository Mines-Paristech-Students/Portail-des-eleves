from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from authentication.models import ProfileQuestion, ProfileAnswer
from authentication.permissions import (
    ProfileQuestionPermission,
    ProfileAnswerPermission,
)
from authentication.serializers import (
    ProfileQuestionSerializer,
    ProfileAnswerSerializer,
)


class ProfileQuestionViewSet(viewsets.ModelViewSet):
    queryset = ProfileQuestion.objects.all()
    serializer_class = ProfileQuestionSerializer
    permission_classes = (ProfileQuestionPermission,)
    pagination_class = None


class ProfileAnswerViewSet(viewsets.ModelViewSet):
    queryset = ProfileAnswer.objects.all()
    serializer_class = ProfileAnswerSerializer
    permission_classes = (ProfileAnswerPermission,)

    search_fields = ("user",)

    def create(self, request, **kwargs):
        request.data["user"] = request.user.id
        return super(ProfileAnswerViewSet, self).create(request)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(["GET"])
def list_profile_questions(request, user_pk):
    questions = ProfileQuestionSerializer(many=True).to_representation(
        ProfileQuestion.objects.all()
    )
    answers = {a.question.id: a for a in ProfileAnswer.objects.filter(user=user_pk)}

    serializer = ProfileAnswerSerializer()

    for question in questions:
        question["answer"] = {}

        if question["id"] in answers:
            question["answer"] = serializer.to_representation(answers[question["id"]])

    return Response({"questions": questions})
