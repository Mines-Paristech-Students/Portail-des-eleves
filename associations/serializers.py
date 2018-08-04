from rest_framework import serializers

from associations.models.association import Association


class AssociationsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name')

    def create(self, validated_data):
        instance = Association.objects.create(**validated_data)
        return instance
