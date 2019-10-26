from rest_framework import serializers
from authentication.models import ProfileAnswer, ProfileQuestion, User


class ProfileQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileQuestion
        fields = ("id", "text")
        read_only_fields = ("id", "text")


class ProfileAnswerSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects)

    class Meta:
        model = ProfileAnswer
        fields = ("id", "text", "question", "user")
