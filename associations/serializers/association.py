from rest_framework import serializers

from associations.models import Group, Association, User
from associations.serializers.page import PageShortSerializer
from associations.serializers.library import LibrarySerializer


class GroupSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=User.objects.all())

    class Meta:
        model = Group
        fields = ('id', 'members', 'role', 'is_admin_group',
                  'static_page', 'news', 'marketplace', 'library', 'vote', 'events')

        extra_kwargs = {'id': {'read_only': False}}

    def update(self, instance, validated_data):
        members_data = validated_data.pop('members')
        for item in validated_data:
            if Group._meta.get_field(item):
                setattr(instance, item, validated_data[item])

        instance.members.clear()

        for person in members_data:
            user = User.objects.get(pk=person)
            instance.members.add(user)

        instance.save()
        return instance


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
    groups = GroupSerializer(many=True, read_only=False)

    marketplace = MarketplaceShortSerializer()
    library = LibrarySerializer()

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages', 'marketplace', 'library', 'groups')

    def update(self, instance, validated_data):
        groups_data = validated_data.pop('groups')
        instance = super().update(instance, validated_data)

        for group_data in groups_data:
            id = dict(group_data)["id"]
            if id == -1:
                group_data.pop("id", None)
                serialised = GroupSerializer(data=group_data)
            else:
                group = Group.objects.get(pk=id)
                serialised = GroupSerializer(group, data=group_data)

            if serialised.is_valid():
                serialised.save()

        instance.save()
        return instance
