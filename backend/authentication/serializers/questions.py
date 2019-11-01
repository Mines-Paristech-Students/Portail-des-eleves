from rest_framework import serializers
from authentication.models import ProfileAnswer, ProfileQuestion, User


class ProfileQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileQuestion
        read_only_fields = ("id",)
        fields = read_only_fields + ("text",)


class ProfileAnswerSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects)

    class Meta:
        model = ProfileAnswer
        read_only_fields = ("id",)
        fields = read_only_fields + ("text", "question", "user")

    def update(self, instance, validated_data):
        # Forbid the update of `question` and `user`.

        if "question" in validated_data:
            validated_data.pop("question")

        if "user" in validated_data:
            validated_data.pop("user")

        return super(ProfileAnswerSerializer, self).update(instance, validated_data)
