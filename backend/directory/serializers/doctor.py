from django.db.models import Q
from rest_framework import serializers

from directory.models import Doctor
from tags.serializers import filter_tags


class DoctorSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    def get_tags(self, obj):
        return filter_tags(self.context, obj, short=True)

    class Meta:
        model = Doctor
        read_only_fields = ("id", "name", "address", "phone", "fee", "tags")
        fields = read_only_fields
