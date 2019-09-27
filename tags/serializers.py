from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from tags.models import Tag, Namespace


class NamespaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Namespace
        fields = ("id", "name", "scope", "scoped_to")

    def validate(self, data):
        if len(data) == 0:
            return data

        if bool(Namespace.SCOPES.get(data.get("scope", None), False)) != bool(
            data.get("scoped_to", False)
        ):  # logical XOR
            raise serializers.ValidationError(
                "Must define scope and scoped_to together"
            )

        data_scope = data.get("scope")
        if data_scope:
            namespace_scope = Namespace.SCOPES.get(data_scope, "no_scope") # None is already the value for global scope
            if namespace_scope is not None and not namespace_scope.objects.get(
                pk=data.get("scoped_to")
            ):
                raise serializers.ValidationError("Not scoped_to an existing object")

        return data

    def to_representation(self, instance):
        response = super(NamespaceSerializer, self).to_representation(instance)
        if not instance.scoped_to:
            del response["scoped_to"]

        return response


class TagSerializer(serializers.ModelSerializer):
    namespace = PrimaryKeyRelatedField(queryset=Namespace.objects.all())

    class Meta:
        model = Tag
        fields = ("id", "value", "namespace")

    def to_representation(self, instance):
        response = super(TagSerializer, self).to_representation(instance)
        response["namespace"] = NamespaceSerializer().to_representation(
            instance.namespace
        )
        return response

    def update(self, instance, validated_data):
        """ Tags may be created or delete but never changed because we don't know the extent of the modification
         - maybe renaming a tag would change values in  places we didn't think of
         - the namespace cannot be changed because a tag cannot be placed on an object outside its namespace
        """
        raise NotImplementedError("Cannot update a tag from the REST API")


class TagShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        read_only_fields = ("id", "value")
        fields = read_only_fields

    def to_representation(self, instance):
        response = super(TagShortSerializer, self).to_representation(instance)
        response["namespace"] = instance.namespace.name
        return response
