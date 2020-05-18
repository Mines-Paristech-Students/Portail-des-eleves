from rest_framework import serializers

from authentication.models import ProfileAnswer


class ProfileAnswerShortSerializer(serializers.ModelSerializer):
    question = serializers.StringRelatedField()

    class Meta:
        model = ProfileAnswer
        read_only_fields = ("id", "question", "text")
        fields = read_only_fields
