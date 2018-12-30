from rest_framework import serializers

from associations.models import Group, Association, User
from associations.serializers.page import PageShortSerializer
from associations.serializers.library import LibrarySerializer
from authentication.serializers import UserShortSerializer


class GroupSerializer(serializers.ModelSerializer):
    members_detail = UserShortSerializer(many=True, source="members", read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'members', 'members_detail', 'role', 'is_admin_group',
                  'static_page', 'news', 'marketplace', 'library', 'vote', 'events')

        extra_kwargs = {'id': {'read_only': False}}

class AssociationsShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name', 'logo')


from associations.serializers.marketplace import MarketplaceShortSerializer


class AssociationsSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True)
    groups = GroupSerializer(many=True)

    marketplace = MarketplaceShortSerializer()
    library = LibrarySerializer()

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages', 'marketplace', 'library', 'groups')

    def update(self, instance, validated_data):
        groups_data = validated_data.pop('groups')
        instance = super().update(instance, validated_data)

        ids = set()

        for group_data in groups_data:
            id = dict(group_data)["id"]

            try:
                group = Group.objects.get(pk=id)
            except Exception: # help requested : too broad catch
                id = -1

            if id == -1:
                group_data.pop("id", None)

                group = GroupSerializer().create(group_data) # help requested : no data validation
                group.save()
                instance.groups.add(group)
                ids.add(group.id)

            else:
                serialized = GroupSerializer(group, data=group_data)

                if serialized.is_valid():
                    serialized.save()
                    ids.add(group.id)

            if not serialized.is_valid():
                raise Exception(serialized.errors)

        for group in instance.groups.all():
            if group.id not in ids:
                group.delete()

        instance.save()
        return instance
