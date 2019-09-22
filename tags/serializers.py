from rest_framework import serializers

from tags.models import Tag, Namespace


class NamespaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Namespace
        fields = ("id", "name", "scope", 'scoped_to')

    def validate_scope(self, value):
        if value not in Namespace.SCOPES.keys():
            raise serializers.ValidationError("The scope isn't valid")
        return value

    def validate(self, data):
        if len(data) == 0:
            return data

        if bool(Namespace.SCOPES.get(data.get("scope", None), False)) != bool(
                data.get("scoped_to", False)):  # logical XOR
            raise serializers.ValidationError("Must define scope and scoped_to together")

        if Namespace.SCOPES.get(data.get("scope")) and not Namespace.SCOPES.get(data.get("scope")).objects.get(
                pk=data.get("scoped_to")):
            raise serializers.ValidationError("Not scoped_to and existing object")

        return data

    def to_representation(self, instance):
        response = super(NamespaceSerializer, self).to_representation(instance)
        if not instance.scoped_to:
            del response["scoped_to"]

        return response


class TagSerializer(serializers.ModelSerializer):
    namespace = NamespaceSerializer()
    
    class Meta:
        model = Tag
        fields = ("id", "value", "scope", "namespace")

    def update(self, instance, validated_data):
        raise NotImplementedError("Cannot update a tag from the REST API")

    def delete(self, instance, validated_data):
        raise NotImplementedError("Cannot delete a tag from the REST API")
