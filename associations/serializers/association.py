from rest_framework import serializers

from associations.models import Group, Association
from associations.serializers.page import PageShortSerializer
from associations.serializers.library import LibrarySerializer
from authentication.serializers import UserShortSerializer


class GroupSerializer(serializers.ModelSerializer):
    members = UserShortSerializer(many=True)

    class Meta:
        model = Group
        fields = ('id', 'members', 'role', 'is_admin_group',
                  'static_page', 'news', 'marketplace', 'library', 'vote', 'events')


class AssociationsShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name', 'logo')

    def create(self, validated_data):
        instance = Association.objects.create(**validated_data)
        return instance

from associations.serializers.marketplace import MarketplaceShortSerializer

class AssociationsSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True)
    groups = GroupSerializer(many=True)

    marketplace = MarketplaceShortSerializer()
    library = LibrarySerializer()

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages', 'marketplace', 'library', 'groups')

    def create(self, validated_data):
        instance = Association.objects.create(**validated_data)
        return instance
