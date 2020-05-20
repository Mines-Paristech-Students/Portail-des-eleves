from rest_framework import serializers

from associations.models import Association


class AssociationShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        read_only_fields = ("id", "name", "logo")
        fields = read_only_fields
