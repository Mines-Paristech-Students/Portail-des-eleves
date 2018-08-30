from rest_framework import serializers

from associations.models import Marketplace


class MarketplaceShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketplace
        fields = ('id', 'enabled', "association")


from associations.serializers.association import AssociationsShortSerializer

class MarketplaceSerializer(serializers.ModelSerializer):
    association = AssociationsShortSerializer()

    class Meta:
        model = Marketplace
        fields = ("id", "enabled", "association")
