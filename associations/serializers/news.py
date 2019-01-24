from rest_framework import serializers

from associations.models import News


class NewsSerializer(serializers.ModelSerializer):

    author = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = News
        fields = ("id", "author", "title", "text", "association")


    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().update(instance, validated_data)
