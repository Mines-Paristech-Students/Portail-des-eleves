from rest_framework import serializers

from associations.models import Marketplace, Product


class MarketplaceShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketplace
        fields = ('id', 'enabled', "association")


from associations.serializers.association import AssociationsShortSerializer


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id", "name", "description", "price", "number_left", "orderable_online")


class MarketplaceSerializer(serializers.ModelSerializer):
    association = AssociationsShortSerializer()
    products = ProductSerializer(many=True)

    class Meta:
        model = Marketplace
        fields = ("id", "enabled", "association", "products")
