from rest_framework import serializers

from associations.models import Page


class PageSerializer(serializers.ModelSerializer):

    author = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Page
        fields = ("id", "title", "text", "association", "author")

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().update(instance, validated_data)


class PageShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ("id", "title")
