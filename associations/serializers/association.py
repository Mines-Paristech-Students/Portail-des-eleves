from rest_framework import serializers

from associations.models import Association, Permission
from associations.serializers.library import LibrarySerializer
from associations.serializers.page import PageShortSerializer


class AssociationsShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name', 'logo')


from associations.serializers.marketplace import MarketplaceShortSerializer


class AssociationsSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True, read_only=True)

    marketplace = MarketplaceShortSerializer()
    library = LibrarySerializer()

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages', 'marketplace', 'library', 'members')


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ("user", "role", "is_admin", "started_at", "ended_at", "static_page", "news", "marketplace",
                  "library", "vote", "events", "association")
