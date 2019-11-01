from rest_framework import serializers

from subscriptions.models import WidgetSubscription


class WidgetSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WidgetSubscription
        fields = ("user", "payload")
