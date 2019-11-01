from rest_framework import relations
from rest_framework import serializers

from associations.models import Association, Page
from tags.serializers import filter_tags


class PageSerializer(serializers.ModelSerializer):
    association = relations.PrimaryKeyRelatedField(
        queryset=Association.objects.all(), read_only=False
    )
    authors = relations.PrimaryKeyRelatedField(many=True, read_only=True)
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Page
        # The dates are automatically set by Django on create or update.
        read_only_fields = (
            "id",
            "authors",
            "creation_date",
            "last_update_date",
            "tags",
        )
        fields = read_only_fields + ("association", "title", "text", "page_type")

    def get_tags(self, obj):
        return filter_tags(self.context, obj, short=False)

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
        fields = read_only_fields + ("title",)
