from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from associations.models import Role
from associations.serializers.association_short import AssociationShortSerializer
from authentication.models import User


class WriteRoleSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), read_only=False
    )

    def __init__(self, used_by_association_admin=False, *args, **kwargs):
        """
        :param used_by_association_admin: set to True if the serializer is used by an administrator of the edited
        association.
        """

        super(WriteRoleSerializer, self).__init__(*args, **kwargs)
        self.used_by_association_admin = used_by_association_admin

    def save(self, **kwargs):
        """If the user is not an association admin, only give them access to the administration_permission field."""
        if not self.used_by_association_admin:
            forbidden_fields = tuple(
                f"{permission_name}_permission"
                for permission_name in Role.PERMISSION_NAMES
                if permission_name != "administration"
            ) + ("start_date", "end_date", "role", "rank")

            for field in forbidden_fields:
                if field in self.validated_data:
                    self.validated_data.pop(field)

        return super(WriteRoleSerializer, self).save(**kwargs)

    def update(self, instance, validated_data):
        # Prevent the changes to association and user fields when updating.
        if "association" in validated_data:
            validated_data.pop("association")

        if "user" in validated_data:
            validated_data.pop("user")

        return super(WriteRoleSerializer, self).update(instance, validated_data)

    def is_valid(self, raise_exception=False):
        """Check if the dates are consistent."""

        self._errors = {}

        if "start_date" in self.initial_data and "end_date" in self.initial_data:
            if self.initial_data["start_date"] >= self.initial_data["end_date"]:
                self._errors = {
                    "field_errors": "field start_date is not consistent with field end_date."
                }

        if self._errors and raise_exception:
            raise ValidationError(self._errors)

        return super(WriteRoleSerializer, self).is_valid(raise_exception)

    def to_representation(self, instance):
        res = super(WriteRoleSerializer, self).to_representation(instance)

        for permission_name in Role.PERMISSION_NAMES:
            res[permission_name] = getattr(instance, permission_name)

        return res

    class Meta:
        model = Role
        read_only_fields = ("id",)
        fields = (
            read_only_fields
            + ("association", "user", "role", "rank", "start_date", "end_date")
            + tuple(
                f"{permission_name}_permission"
                for permission_name in Role.PERMISSION_NAMES
            )
        )


class RoleSerializer(serializers.ModelSerializer):
    association = AssociationShortSerializer(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = Role
        read_only_fields = (
            "id",
            "association",
            "user",
            "role",
            "rank",
            "start_date",
            "end_date",
            "permissions",
        )
        fields = read_only_fields

    def save(self, **kwargs):
        raise RuntimeError(
            "The serializer `RoleSerializer` should not be used for writing operations."
        )

    def get_permissions(self, obj: Role):
        return obj.permissions
