from rest_framework import serializers

from associations.serializers import RoleSerializer
from authentication.models import User
from authentication.serializers.questions_short import ProfileAnswerShortSerializer


class UserShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        read_only_fields = ("id", "first_name", "last_name", "promotion")
        fields = read_only_fields


class UpdateOnlyUserSerializer(serializers.ModelSerializer):
    """This serializer only allows the updates allowed to the common users."""

    roommate = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, read_only=False
    )
    minesparent = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, read_only=False
    )

    class Meta:
        model = User
        fields = (
            "nickname",
            "phone",
            "room",
            "address",
            "city_of_origin",
            "option",
            "current_academic_year",
            "roommate",
            "minesparent",
        )

    def create(self, validated_data):
        raise NotImplemented(
            "This serializer should not be used for create operations."
        )

    def update(self, instance: User, validated_data):
        if "roommate" in validated_data:
            roommate_data = validated_data.pop("roommate", None)

            instance.roommate.clear()

            for user in roommate_data:
                instance.roommate.add(user)

        if "minesparent" in validated_data:
            minesparent = validated_data.pop("minesparent", None)

            instance.minesparent.clear()

            for user in minesparent:
                instance.minesparent.add(user)

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
