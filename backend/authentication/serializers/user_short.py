from rest_framework import serializers

from authentication.models import User


class UserShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        read_only_fields = ("id", "first_name", "last_name", "promotion", "is_staff")
        fields = read_only_fields
