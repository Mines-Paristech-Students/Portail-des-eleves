from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.filters import SearchFilter

from authentication.models import ProfileQuestion, ProfileAnswer
from authentication.serializers import ProfileQuestionSerializer, ProfileAnswerSerializer


class ProfileQuestionViewSet(viewsets.ModelViewSet):
    queryset = ProfileQuestion.objects.all()
    serializer_class = ProfileQuestionSerializer


class ProfileAnswerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user to be viewed or edited.
    """
    queryset = ProfileAnswer.objects.all()
    serializer_class = ProfileAnswerSerializer

    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('user',)

    def create(self, request, **kwargs):
        request.data["user"] = request.user.id
        return super(ProfileAnswerViewSet, self).create(request)


@api_view(['GET'])
def get_profile_questions(request, user_pk):
    questions = ProfileQuestion.objects.all()
    questions = ProfileQuestionSerializer(many=True).to_representation(questions)

    answers = ProfileAnswer.objects.filter(user=user_pk).all()
    answers = {a.question.id: a for a in answers}
    serializer = ProfileAnswerSerializer()

    for question in questions:
        if question["id"] in answers:
            question["answer"] = serializer.to_representation(answers[question["id"]])

    return JsonResponse({"questions": questions})
