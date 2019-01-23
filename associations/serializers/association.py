from rest_framework import serializers

from associations.models import Group, Association, User
from associations.serializers.page import PageShortSerializer
from associations.serializers.library import LibrarySerializer
from authentication.serializers import UserShortSerializer


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ('id', 'members', 'role', 'is_admin_group',
                  'static_page', 'news', 'marketplace', 'library', 'vote', 'events')

    def to_representation(self, instance):
        """This is litteraly an amazing hack
        We use a single `members` field for read and write operations
        You can write to it as usual using an array of members unique id (15xxxx)
        But when you read it, you will get more details using another serializer

        This allows us not to use two different field names for read and write operations in that case
        """
        response = super().to_representation(instance)
        response['members'] = UserShortSerializer(instance.members, many=True).data
        return response

class AssociationsShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name', 'logo')


from associations.serializers.marketplace import MarketplaceShortSerializer


class AssociationsSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True, read_only=True)
    groups = GroupSerializer(many=True, read_only=True)

    marketplace = MarketplaceShortSerializer()
    library = LibrarySerializer()

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages', 'marketplace', 'library', 'groups')

