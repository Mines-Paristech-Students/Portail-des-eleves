from rest_framework import serializers

from authentication.models import User
from authentication.serializers.questions_short import ProfileAnswerShortSerializer


class UserShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        read_only_fields = ("id", "first_name", "last_name")
        fields = read_only_fields


class UserSerializer(serializers.ModelSerializer):
    roommate = UserShortSerializer(many=True, read_only=True)
    minesparent = UserShortSerializer(many=True, read_only=True)
    fillots = UserShortSerializer(many=True, read_only=True)
    profile_answers = ProfileAnswerShortSerializer(many=True, read_only=True)

    class Meta:
        model = User
        read_only_fields = (
            "id",
            "first_name",
            "last_name",
            "birthday",
            "email",
            "year_of_entry",
            "promotion",
            "student_type",
            "current_academic_year",
            "is_active",
            "is_staff",
            "profile_answers",
        )
        fields = read_only_fields + (
            "nickname",
            "phone",
            "room",
            "address",
            "city_of_origin",
            "option",
            "roommate",
            "minesparent",
            "fillots",
        )
