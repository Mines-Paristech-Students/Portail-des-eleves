from rest_framework import serializers

from associations.models import Association


class AssociationShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        read_only_fields = ("id", "name", "logo", "enabled_modules", "rank")
        fields = read_only_fields

    def save(self, **kwargs):
        raise NotImplementedError("This serializer is read-only.")
