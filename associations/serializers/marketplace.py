from rest_framework import serializers

from associations.models import Association, Marketplace, Product, Order, Funding
from associations.serializers.association import AssociationsShortSerializer


class ProductSerializer(serializers.ModelSerializer):
    marketplace = serializers.PrimaryKeyRelatedField(queryset=Marketplace.objects.all())

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'comment', 'marketplace', 'number_left')


class ProductShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('name', 'description', 'price', 'number_left', "orderable_online", "marketplace",
                  "still_in_the_catalogue")


class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Order
        fields = ("id", "product", "buyer", "quantity", "value", "date", "status")


class FundingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funding
        fields = ("id", "value", "date", "user", "status")


class MarketplaceShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketplace
        fields = ('id', 'enabled', "association")


class MarketplaceSerializer(serializers.ModelSerializer):
    products = ProductShortSerializer(many=True)

    class Meta:
        model = Marketplace
        fields = ("id", "enabled", "association", "products")

    def create(self, validated_data):
        """Create a new instance of Marketplace based upon validated_data."""

        # A new Marketplace is linked to an existing association.
        association_data = validated_data.pop('association')
        association = Association.objects.get(pk=association_data)

        # A new Marketplace may come with new products.
        products_data = validated_data.pop('products')

        # Insert the Marketplace first, then the products, because the newly created Marketplace object is needed to
        # create the products.
        marketplace = Marketplace.objects.create(**validated_data)
        association.marketplace = marketplace
        association.save()

        # Insert the products.
        for product_data in products_data:
            Product.objects.create(name=product_data['name'],
                                   description=product_data.get('description', None),
                                   price=product_data.get('price', 0),
                                   number_left=product_data.get('number_left', -1),
                                   image=product_data.get('image', None),
                                   comment=product_data.get('comment', None),
                                   marketplace=marketplace)

        return marketplace

    def update(self, instance, validated_data):
        """
            Update an existing instance of Marketplace based upon validated_data.\n
            The nested fields association and products will not be updated.
        """

        instance.enabled = validated_data.get('enabled', instance.enabled)
        instance.save()
        return instance

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)

        res['association'] = AssociationsShortSerializer().to_representation(
            Association.objects.get(pk=res['association']))
        return res
