from rest_framework import serializers

from associations.serializers.role import RoleSerializer
from authentication.models import User, ProfileAnswer
from authentication.serializers.questions_short import (
    ProfileAnswerShortSerializer,
    ProfileAnswerShortUpdateSerializer,
)
from authentication.serializers.user_short import UserShortSerializer


class UpdateOnlyUserSerializer(serializers.ModelSerializer):
    """This serializer only allows the updates allowed to the common users."""

    roommate = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, read_only=False
    )
    minesparent = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, read_only=False
    )
    astcousin = serializers.PrimaryKeyRelatedField(
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
            "astcousin",
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
        if "astcousin" in validated_data:
            # Update strategy for astcousin: remove the old relationships and add the new ones.
            cousin_data = validated_data.pop("astcousin")

            instance.astcousin.clear()

            for user in cousin_data:
                if user.id != instance.id:  # An user cannot be its own cousin.
                    instance.astcousin.add(user)

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


user_read_only_fields = (
    "id",
    "first_name",
    "last_name",
    "nickname",
    "birthday",
    "email",
    "year_of_entry",
    "phone",
    "room",
    "city_of_origin",
    "option",
    "student_type",
    "current_academic_year",
    "roommate",
    "is_active",
    "is_staff",
    "profile_answers",
    "roles",
    "promotion",
)


class HiddenParentReadOnlyUserSerializer(serializers.ModelSerializer):
    roommate = UserShortSerializer(many=True, read_only=True)
    profile_answers = ProfileAnswerShortSerializer(many=True, read_only=True)
    roles = RoleSerializer(many=True, read_only=True)

    def create(self, validated_data):
        raise NotImplemented("This serializer should not be used for write operations.")

    def update(self, instance, validated_data):
        raise NotImplemented("This serializer should not be used for write operations.")

    class Meta:
        model = User
        read_only_fields = user_read_only_fields
        fields = read_only_fields


class ReadOnlyUserSerializer(serializers.ModelSerializer):
    minesparent = UserShortSerializer(many=True, read_only=True)
    astcousin = UserShortSerializer(many=True, read_only=True)
    fillots = UserShortSerializer(many=True, read_only=True)
    roommate = UserShortSerializer(many=True, read_only=True)
    profile_answers = ProfileAnswerShortSerializer(many=True, read_only=True)
    roles = RoleSerializer(many=True, read_only=True)

    def create(self, validated_data):
        raise NotImplemented("This serializer should not be used for write operations.")

    def update(self, instance, validated_data):
        raise NotImplemented("This serializer should not be used for write operations.")

    class Meta:
        model = User
        read_only_fields = user_read_only_fields + (
            "minesparent",
            "astcousin",
            "fillots",
        )
        fields = read_only_fields
