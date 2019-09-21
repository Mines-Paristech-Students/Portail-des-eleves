from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_bulk.drf3.serializers import BulkSerializerMixin
from rest_framework_bulk.serializers import BulkListSerializer

from associations.models import Association, Role
from associations.serializers.page import PageShortSerializer
from authentication.serializers.user import UserShortSerializer


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
        read_only_fields = ('id', 'user', 'association')
        fields = '__all__'
        list_serializer_class = AdaptedBulkListSerializer

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserShortSerializer(instance.user).data
        return response


class RoleShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        read_only_fields = ('id', 'user', 'association', 'role', 'rank')
        fields = read_only_fields

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserShortSerializer(instance.user).data
        return response


class AssociationShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        read_only_fields = ('id', 'name', 'logo')


from associations.serializers.marketplace import MarketplaceShortSerializer
from associations.serializers.library import LibraryShortSerializer


class AssociationSerializer(serializers.ModelSerializer):
    pages = PageShortSerializer(many=True, read_only=True)
    marketplace = MarketplaceShortSerializer(read_only=True)
    library = LibraryShortSerializer(read_only=True)
    my_role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Association
        read_only_fields = ('pages', 'marketplace', 'library', 'my_role')
        fields = read_only_fields + ('id', 'name', 'logo', 'is_hidden', 'rank')

    def get_my_role(self, obj):
        role = self.context['request'].user.get_role(obj)
        return RoleSerializer(role).data if role else {}
