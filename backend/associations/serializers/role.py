from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from associations.models import Role
from associations.serializers.association_short import AssociationShortSerializer
from authentication.models import User
from authentication.serializers.user_short import UserShortSerializer


class WriteRoleSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), read_only=False
    )

    permissions = serializers.MultipleChoiceField(choices=Role.PERMISSION_NAMES)

    class Meta:
        model = Role
        read_only_fields = ("id",)
        fields = read_only_fields + (
            "association",
            "user",
            "role",
            "rank",
            "start_date",
            "end_date",
            "permissions",
        )

    def __init__(self, used_by_association_admin=False, *args, **kwargs):
        """
        :param used_by_association_admin: set to True if the serializer is used by an administrator of the edited
        association.
        """

        super(WriteRoleSerializer, self).__init__(*args, **kwargs)
        self.used_by_association_admin = used_by_association_admin

    def save(self, **kwargs):
        """If the user is not an association admin, only give them access to the "administration" permission."""

        if not self.used_by_association_admin:
            if "permissions" in self.validated_data:
                self.validated_data["permissions"] = (
                    ["administration"]
                    if "administration" in self.validated_data["permissions"]
                    else []
                )

        # Update the permissions: `{permission_name}_permission` is True if and only if `permission_name` is present
        # in the provided `permissions` list.
        if "permissions" in self.validated_data:
            for permission_name in Role.PERMISSION_NAMES:
                self.validated_data[f"{permission_name}_permission"] = (
                    permission_name in self.validated_data["permissions"]
                )

            self.validated_data.pop("permissions")

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

        if (
            "start_date" in self.initial_data
            and "end_date" in self.initial_data
            and self.initial_data["end_date"] is not None
        ):
            if self.initial_data["start_date"] >= self.initial_data["end_date"]:
                self._errors = {
                    "field_errors": "field start_date is not consistent with field end_date."
                }

        if "permissions" in self.initial_data:
            extra_values = set(self.initial_data["permissions"]).difference(
                set(Role.PERMISSION_NAMES)
            )

            if len(extra_values) > 0:
                self._errors.update(
                    {
                        "field_errors": f"permissions contains values which are not allowed: {extra_values}."
                    }
                )

        if self._errors and raise_exception:
            raise ValidationError(self._errors)

        return super(WriteRoleSerializer, self).is_valid(raise_exception)


class RoleSerializer(serializers.ModelSerializer):
    association = AssociationShortSerializer(read_only=True)
    user = UserShortSerializer(read_only=True)
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
