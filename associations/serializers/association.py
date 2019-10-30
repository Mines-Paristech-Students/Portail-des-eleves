from rest_framework import serializers

from associations.models import Association, Role
from associations.serializers.page import PageShortSerializer
from authentication.models import User
from authentication.serializers.user import UserShortSerializer


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
            ) + ("is_archived", "role", "rank")

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
            + ("association", "user", "role", "rank", "is_archived")
            + tuple(
                f"{permission_name}_permission"
                for permission_name in Role.PERMISSION_NAMES
            )
        )


class RoleSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(read_only=True)

    def to_representation(self, instance):
        res = super(RoleSerializer, self).to_representation(instance)

        for permission_name in Role.PERMISSION_NAMES:
            res[permission_name] = getattr(instance, permission_name)

        return res

    class Meta:
        model = Role
        read_only_fields = (
            "id",
            "association",
            "user",
            "role",
            "rank",
            "is_archived",
        ) + tuple(
            f"{permission_name}_permission" for permission_name in Role.PERMISSION_NAMES
        )
        fields = read_only_fields

    def save(self, **kwargs):
        raise RuntimeError(
            "The serializer `RoleSerializer` should not be used for writing operations."
        )


class RoleShortSerializer(serializers.ModelSerializer):
    user = UserShortSerializer(read_only=True)

    class Meta:
        model = Role
        read_only_fields = ("id", "user", "association", "role", "rank")
        fields = read_only_fields


class AssociationShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        read_only_fields = ("id", "name", "logo")
        fields = read_only_fields


from associations.serializers.marketplace import MarketplaceShortSerializer
from associations.serializers.library import LibraryShortSerializer


class AssociationSerializer(serializers.ModelSerializer):
    pages = serializers.SerializerMethodField()
    marketplace = MarketplaceShortSerializer(read_only=True)
    library = LibraryShortSerializer(read_only=True)
    my_role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Association
        read_only_fields = ("pages", "marketplace", "library", "my_role")
        fields = read_only_fields + ("id", "name", "logo", "is_hidden", "rank")

    def get_my_role(self, obj):
        role = self.context["request"].user.get_role(obj)
        return RoleSerializer(role).data if role else {}

    def get_pages(self, obj):
        # Get the current user.
        request = self.context.get("request", None)
        user = getattr(request, "user", None)

        # Return the serialized representation of the pages.
        if user and user.is_authenticated and not user.show:
            return PageShortSerializer(
                obj.pages.exclude(tags__is_hidden=True), many=True
            ).data

        return PageShortSerializer(obj.pages.all(), many=True).data


class AssociationLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ("logo",)
