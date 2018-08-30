from rest_framework import serializers

from associations.models import Page


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ("id", "title", "text", "association")


class PageShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ("id", "title")
