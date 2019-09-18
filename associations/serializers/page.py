from rest_framework import serializers
from rest_framework import relations

from associations.models import Page


class PageSerializer(serializers.ModelSerializer):
    association = relations.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Page
        read_only_fields = ('id', 'association',)
        fields = read_only_fields + ('title', 'text',)


class PageShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        read_only_fields = ('id',)
        fields = ('title',)
