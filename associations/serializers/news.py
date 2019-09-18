from rest_framework import serializers

from associations.models import News


class NewsSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True,
                                                default=serializers.CurrentUserDefault())

    class Meta:
        model = News
        read_only_fields = ('id', 'association', 'author', 'date')
        fields = read_only_fields + ('title', 'text',)
