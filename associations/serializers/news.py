from rest_framework import serializers

from associations.models import News


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ("id", "title", "text", "association")
