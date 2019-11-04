from django.db.models import Q
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from tags.models import Tag, Namespace


def filter_nested_attribute(
    context, main_object, serializer_class, nested_attribute, exclude_condition
):
    """
        This function is a helper function for the Serializers which have to return nested objects but want to filter
        them if the user is not `show`.

        For instance, to filter out the `events` of a `Association` object, one could do like this:
            topics = serializersSerializerMethodField()

            def get_topics(self, obj):
                return filter_nested_attribute(
                    self.context, obj, EventSerializer, "events", Q(tags__is_hidden=True)
                )

        Don't forget to add `topics` to `read_only_fields` or `fields`. ;)
    """

    # Get the current user.
    user = None
    request = context.get("request")

    if request and hasattr(request, "user"):
        user = request.user

    # Return the serialized representation of the nested attribute.
    if user and user.is_authenticated and not user.show:
        return serializer_class(
            getattr(main_object, nested_attribute).exclude(exclude_condition), many=True
        ).data

    return serializer_class(
        getattr(main_object, nested_attribute).all(), many=True
    ).data


def filter_tags(context, main_object, short=False):
    """
        Shortcut to use `TagShortSerializer` or `TagSerializer` with `filter_nested_attributes`.
        Use it like this:
            tags = serializers.SerializerMethodField()

            def get_tags(self, obj):
                return filter_tags(self.context, obj, short=True)

        :param context should be `self.context` in the context of a `get_tags` `Serializer` method.
        :param main_object should be `obj`, the second parameter of a `get_tags` `Serializer` method.
        :param short use `TagShortSerializer` if set to True, `TagSerializer` otherwise.r.
    """

    return filter_nested_attribute(
        context,
        main_object,
        TagShortSerializer if short else TagSerializer,
        "tags",
        Q(is_hidden=True),
    )


class NamespaceShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Namespace
        read_only_fields = ("id", "name", "scoped_to_pk", "scoped_to_model")
        fields = read_only_fields


class NamespaceSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Namespace
        read_only_fields = ("id", "tags")
        fields = read_only_fields + ("name", "scoped_to_pk", "scoped_to_model")

    def get_tags(self, obj):
        return filter_tags(self.context, obj, short=True)

    def validate(self, data):
        if len(data) == 0:
            return data

        if bool(
            Namespace.SCOPED_TO_MODELS.get(data.get("scoped_to_model", None), False)
        ) != bool(
            data.get("scoped_to_pk", False)
        ):  # logical XOR
            raise serializers.ValidationError(
                "Must define scoped_to_pk and scoped_to_model together"
            )

        data_scope = data.get("scoped_to_model")
        if data_scope:
            namespace_scope = Namespace.SCOPED_TO_MODELS.get(
                data_scope, "no_scope"
            )  # None is already the value for global scope
            if namespace_scope is not None and not namespace_scope.objects.get(
                pk=data.get("scoped_to_pk")
            ):
                raise serializers.ValidationError("Not scoped_to an existing object")

        return data

    def to_representation(self, instance):
        response = super(NamespaceSerializer, self).to_representation(instance)
        if not instance.scoped_to_model:
            del response["scoped_to_model"]

        return response


class TagSerializer(serializers.ModelSerializer):
    namespace = PrimaryKeyRelatedField(queryset=Namespace.objects.all())

    class Meta:
        model = Tag
        fields = ("id", "value", "namespace")

    def to_representation(self, instance):
        response = super(TagSerializer, self).to_representation(instance)
        response["namespace"] = NamespaceShortSerializer().to_representation(
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
