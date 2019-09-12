from django.forms import CharField
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework_jwt.serializers import User

from repartitions.models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    manager = PrimaryKeyRelatedField(queryset=User.objects.all())
    status = CharField(max_length=100)

    class Meta:
        model = Campaign
        fields = ("id", "name", "manager", "status")

    def validate_status(self, status: str):
        if status not in Campaign.STATUS:
            raise serializers.ValidationError("Status is not valid")

        return status
