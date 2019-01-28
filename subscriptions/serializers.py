from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from authentication.models import User
from subscriptions.models import Widget, AssociationSubscription, WidgetSubscription

class WidgetSerializer(serializers.Serializer):
    name = serializers.CharField(read_only=True)

    def create(self, validated_data):
        """Do not allow widget creation"""
        pass

    def update(self, instance, validated_data):
        """Do not allow widget updating"""
        pass

class WidgetSubscriptionSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    widget = serializers.PrimaryKeyRelatedField(read_only=True)
    displayed = serializers.BooleanField(read_only=True)

    def create(self, validated_data):
        """Do not allow subscription creation from here"""
        pass

    def update(self, instance, validated_data):
        """Do not allow subscription updating from here"""
        pass

class AssociationSubscriptionSerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    association = serializers.PrimaryKeyRelatedField(read_only=True)
    subscribed = serializers.BooleanField(read_only=True)

    def create(self, validated_data):
        """Do not allow subscription creation from here"""
        pass

    def update(self, instance, validated_data):
        """Do not allow subscription updating from here"""
        pass
