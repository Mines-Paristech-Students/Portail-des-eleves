from rest_framework import serializers

from repartitions.models import Campaign

class RepartitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ("id", "title")
