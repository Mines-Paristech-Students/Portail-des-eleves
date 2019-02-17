from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from associations.models import Association, Permission, User
from associations.serializers.page import PageShortSerializer
from authentication.serializers import UserShortSerializer


class AssociationsShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name', 'logo')


from associations.serializers.marketplace import MarketplaceShortSerializer
from associations.serializers.library import LibraryShortSerializer


class PermissionSerializer(serializers.ModelSerializer):
    user = PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Permission
        fields = ("id", "user", "role", "is_admin", "is_archived", "static_page", "news", "marketplace",
                  "library", "vote", "events", "association")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)
        res["user"] = UserShortSerializer().to_representation(instance.user)
        return res


class AssociationsSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True, read_only=True)

    marketplace = MarketplaceShortSerializer()
    library = LibraryShortSerializer()

    permissions = PermissionSerializer(many=True)

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages', 'marketplace', 'library', 'permissions')
