from rest_framework import serializers

from repartitions.models import Repartition

class RepartitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repartition
        fields = ("id", "title", "promotion", "status", "equirepartition")
