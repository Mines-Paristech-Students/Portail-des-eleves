from rest_framework import serializers

from associations.models import Association


from associations.serializers.role import RoleSerializer


class AssociationSerializer(serializers.ModelSerializer):
    my_role = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Association
        read_only_fields = ("id", "my_role", "marketplace_enabled", "library_enabled")
        fields = read_only_fields + ("name", "logo", "is_hidden", "rank")

    def get_my_role(self, obj):
        role = self.context["request"].user.get_role(obj)
        return RoleSerializer(role).data if role else {}


class AssociationLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Association
        fields = ("logo",)
