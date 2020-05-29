from rest_framework import serializers

from authentication.models import ProfileAnswer, ProfileQuestion


class ProfileAnswerShortSerializer(serializers.ModelSerializer):
    question = serializers.StringRelatedField()
    question_id = serializers.SerializerMethodField()

    def get_question_id(self, answer: ProfileAnswer):
        return answer.question.id

    class Meta:
        model = ProfileAnswer
        read_only_fields = ("id", "question_id", "question", "text")
        fields = read_only_fields


class ProfileAnswerShortUpdateSerializer(serializers.ModelSerializer):
    question = serializers.PrimaryKeyRelatedField(
        queryset=ProfileQuestion.objects.all()
    )

    class Meta:
        model = ProfileAnswer
        read_only_fields = ("id",)
        fields = read_only_fields + ("question", "text")
