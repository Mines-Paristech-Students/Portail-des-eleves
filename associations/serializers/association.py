from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework_bulk.drf3.serializers import BulkSerializerMixin
from rest_framework_bulk.serializers import BulkListSerializer

from associations.models import Association, Role
from associations.models import User
from associations.serializers.page import PageShortSerializer
from authentication.serializers import UserShortSerializer


class AssociationsShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ('id', 'name', 'logo')


class AdaptedBulkListSerializerMixin(object):
    def to_internal_value(self, data):
        """
        List of dicts of native values <- List of dicts of primitive datatypes.
        """

        if not isinstance(data, list):
            message = self.error_messages['not_a_list'].format(
                input_type=type(data).__name__
            )
            raise ValidationError({
                'test': [message]
            }, code='not_a_list')

        if not self.allow_empty and len(data) == 0:
            if self.parent and self.partial:
                raise ValidationError()

            message = self.error_messages['empty']
            raise ValidationError({
                'test': [message]
            }, code='empty')

        ret = []
        errors = []

        for item in data:
            try:
                # Code that was inserted
                self.child.instance = self.instance.get(id=item['id']) if self.instance else None
                self.child.initial_data = item
                # Until here
                validated = self.child.run_validation(item)
            except ValidationError as exc:
                errors.append(exc.detail)
            else:
                ret.append(validated)
                errors.append({})

        if any(errors):
            raise ValidationError(errors)

        return ret


class AdaptedBulkListSerializer(AdaptedBulkListSerializerMixin, BulkListSerializer):
    pass


class RoleSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"
        list_serializer_class = AdaptedBulkListSerializer

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserShortSerializer(instance.user).data
        return response


class RoleShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'user', 'association', 'role', 'rank')

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserShortSerializer(instance.user).data
        return response


from associations.serializers.marketplace import MarketplaceShortSerializer
from associations.serializers.library import LibraryShortSerializer


class AssociationsSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True, read_only=True)
    my_role = serializers.SerializerMethodField(read_only=True)
    marketplace = MarketplaceShortSerializer()
    library = LibraryShortSerializer()

    class Meta:
        model = Association
        fields = ('id', 'name', 'logo', 'pages', 'marketplace', 'library', 'my_role')

    def get_my_role(self, obj):
        qs = Role.objects.filter(user=self.context['request'].user, association=obj)
        if qs.exists():
            serializer = RoleSerializer(qs[0])
            return serializer.data
        else:
            return {}

