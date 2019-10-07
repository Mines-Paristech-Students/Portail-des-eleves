from rest_framework import serializers

from authentication.models import User


class UserSerializer(serializers.ModelSerializer):
    roommate = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True
    )
    minesparent = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True
    )

    class Meta:
        model = User
        read_only_fields = (
            "first_name",
            "last_name",
            "birthday",
            "email",
            "year_of_entry",
            "student_type",
            "is_active",
            "is_admin",
        )
        fields = read_only_fields + (
            "nickname",
            "phone",
            "room",
            "address",
            "city_of_origin",
            "option",
            "sports",
            "roommate",
            "minesparent",
        )


class UserShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name")
        read_only_fields = ("first_name", "last_name")
