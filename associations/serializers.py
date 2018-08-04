from rest_framework import serializers

from associations.models import Page, News
from associations.models.association import Association


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

class AssociationsShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name', 'logo')

    def create(self, validated_data):
        instance = Association.objects.create(**validated_data)
        return instance


class AssociationsSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True)

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages')

    def create(self, validated_data):
        instance = Association.objects.create(**validated_data)
        return instance
