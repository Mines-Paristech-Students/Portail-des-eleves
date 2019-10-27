from rest_framework import relations
from rest_framework import serializers

from associations.models import Association, Page, User


class PageSerializer(serializers.ModelSerializer):
    association = relations.PrimaryKeyRelatedField(
        queryset=Association.objects.all(), read_only=False
    )
    authors = relations.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Page
        # The dates are automatically set by Django on create or update.
        read_only_fields = ("id", "authors", "creation_date", "last_update_date")
        fields = read_only_fields + ("association", "title", "text", "page_type")

    def save(self, author, **kwargs):
        """Override the save method to add `author` to the authors field."""
        instance = super(PageSerializer, self).save(**kwargs)
        instance.authors.add(author)
        return instance

    def update(self, instance, validated_data):
        # Prevent the changes to the association field when updating.
        if "association" in validated_data:
            validated_data.pop("association")

        return super(PageSerializer, self).update(instance, validated_data)


class PageShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        read_only_fields = ("id",)
        fields = ("title",)
