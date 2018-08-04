from rest_framework import serializers

from associations.models import Page, News
from associations.models.association import Association, Group

from authentication.serializers import UserShortSerializer


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ("id", "title", "text", "association")


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ("id", "title", "text", "association")


class PageShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ("id", "title")

class GroupSerializer(serializers.ModelSerializer):
    members = UserShortSerializer(many=True)

    class Meta:
        model = Group
        fields = ('id', 'members', 'role', 'is_admin_group', 'static_page','news','marketplace','library','vote','events')


class AssociationsShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name', 'logo')

    def create(self, validated_data):
        instance = Association.objects.create(**validated_data)
        return instance


class AssociationsSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True)
    groups = GroupSerializer(many=True)

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages', 'market', 'library', 'groups')

    def create(self, validated_data):
        instance = Association.objects.create(**validated_data)
        return instance
