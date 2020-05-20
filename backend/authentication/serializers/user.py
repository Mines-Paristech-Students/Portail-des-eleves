from rest_framework import serializers, exceptions

from associations.serializers import RoleSerializer
from authentication.models import User, ProfileAnswer, ProfileQuestion
from authentication.serializers.questions_short import (
    ProfileAnswerShortSerializer,
    ProfileAnswerShortUpdateSerializer,
)


class UserShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        read_only_fields = ("id", "first_name", "last_name", "promotion", "is_staff")
        fields = read_only_fields


class UpdateOnlyUserSerializer(serializers.ModelSerializer):
    """This serializer only allows the updates allowed to the common users."""

    roommate = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, read_only=False
    )
    minesparent = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, read_only=False
    )
    profile_answers = ProfileAnswerShortUpdateSerializer(many=True, read_only=False)

    class Meta:
        model = User
        fields = (
            "nickname",
            "phone",
            "room",
            "city_of_origin",
            "option",
            "current_academic_year",
            "roommate",
            "minesparent",
            "profile_answers",
        )

    def is_valid(self, raise_exception=False):
        return super(UpdateOnlyUserSerializer, self).is_valid(raise_exception)

    def create(self, validated_data):
        raise NotImplemented("This serializer cannot be used for create operations.")

    def update(self, instance: User, validated_data):
        if "roommate" in validated_data:
            # Update strategy for roommate: remove the old relationships and add the new ones.
            roommate_data = validated_data.pop("roommate")

            instance.roommate.clear()

            for user in roommate_data:
                if user.id != instance.id:  # An user cannot be its own roommate.
                    instance.roommate.add(user)

        if "minesparent" in validated_data:
            # Update strategy for minesparent: remove the old relationships and add the new ones.
            minesparent = validated_data.pop("minesparent")

            instance.minesparent.clear()

            for user in minesparent:
                if user.id != instance.id:  # An user cannot be its own minesparent.
                    instance.minesparent.add(user)

        if "profile_answers" in validated_data:
            # Update strategy for profile_answers: remove the old answers and add the new ones.
            profile_answers = validated_data.pop("profile_answers")

            ProfileAnswer.objects.all().filter(user=instance).delete()

            for profile_answer in profile_answers:
                if not str(profile_answer["text"]).isspace():
                    ProfileAnswer.objects.create(
                        user=instance,
                        question=profile_answer["question"],
                        text=profile_answer["text"],
                    )

        return super(UpdateOnlyUserSerializer, self).update(instance, validated_data)


class ReadOnlyUserSerializer(serializers.ModelSerializer):
    roommate = UserShortSerializer(many=True, read_only=True)
    minesparent = UserShortSerializer(many=True, read_only=True)
    profile_answers = ProfileAnswerShortSerializer(many=True, read_only=True)
    roles = RoleSerializer(many=True, read_only=True)
    fillots = UserShortSerializer(many=True, read_only=True)

    def create(self, validated_data):
        raise NotImplemented("This serializer should not be used for write operations.")

    def update(self, instance, validated_data):
        raise NotImplemented("This serializer should not be used for write operations.")

    class Meta:
        model = User
        read_only_fields = (
            "id",
            "first_name",
            "last_name",
            "nickname",
            "birthday",
            "email",
            "year_of_entry",
            "phone",
            "room",
            "address",
            "city_of_origin",
            "option",
            "student_type",
            "current_academic_year",
            "roommate",
            "minesparent",
            "is_active",
            "is_staff",
            "profile_answers",
            "roles",
            "fillots",
            "promotion",
        )
        fields = read_only_fields
