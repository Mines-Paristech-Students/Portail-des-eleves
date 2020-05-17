from rest_framework import serializers

from associations.models import Association
from associations.serializers.page import PageShortSerializer


from associations.serializers.marketplace import MarketplaceShortSerializer
from associations.serializers.library import LibraryShortSerializer
from associations.serializers.role import RoleSerializer


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
