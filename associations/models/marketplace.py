from django.db import models
from authentication.models import User


class Marketplace(models.Model):
    """
        Provide an interface to sell objects to people.
    """

    id = models.SlugField(max_length=200, primary_key=True)
    enabled = models.BooleanField(default=False)


class Product(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2, min_value=0)
    image = models.ImageField()
    comment = models.TextField(null=True, blank=True)

    marketplace = models.ForeignKey(Marketplace, models.CASCADE, related_name="products")

    # By convention, -1 = unlimited number of this product.
    number_left = models.IntegerField(default=-1)
    still_in_the_catalogue = models.BooleanField(default=True)

    # Can someone buy it on the site ? Ex : YES for Pain de Mine / NO for BDA
    orderable_online = models.BooleanField(default=True)

    def __str__(self):
        return "{} ({})".format(self.name, self.marketplace.id)


class Order(models.Model):
    id = models.AutoField(primary_key=True)

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)
    value = models.DecimalField(max_digits=5,
                                decimal_places=2)  # Total value should be remembered because the price might change
    date = models.DateTimeField(auto_now=True)

    #           --- CANCELLED
    #          /
    # ORDERED ----- VALIDATED ------ DELIVERED ----- REFUNDED
    #          \
    #           --- REJECTED

    STATUS = (
        ("ORDERED", "Commandé"),  # The buyer passed the purchase order.
        ("CANCELLED", "Annulé"),  # The buyer cancels the order.
        ("REJECTED", "Refusé"),  # The seller cannot honor the request.
        ("VALIDATED", "Validé"),  # The seller confirms it can honor the request.
        ("DELIVERED", "Délivré"),  # The product has been given. The order cannot be CANCELLED then.
        ("REFUNDED", "Remboursé"),  # The order has been delivered but it was faulty (or else), so it has been refunded.
    )
    status = models.CharField(choices=STATUS, max_length=200)


class Funding(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    value = models.DecimalField(max_digits=5, decimal_places=2)
    date = models.DateTimeField(auto_now=True)

    marketplace = models.ForeignKey(Marketplace, models.CASCADE, related_name="fundings")

    STATUS = (
        ("FUNDED", "Versé"),  # The buyer passed the purchase order
        ("REFUNDED", "Remboursé")  # The order has been delivered but it was faulty (or else), so it has been refunded
    )
    status = models.CharField(choices=STATUS, max_length=200, default="FUNDED")
