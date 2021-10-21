from django.core.validators import MinValueValidator
from django.db import models
from django.utils.functional import cached_property

from authentication.models import User


class Marketplace(models.Model):
    """
    Provide an interface to sell objects to people.
    """

    id = models.SlugField(max_length=200, primary_key=True)
    enabled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-id"]


class Subscription(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, models.CASCADE, related_name="subscription_users")
    marketplace = models.ForeignKey(
        Marketplace, models.CASCADE, related_name="subscription_marketplaces"
    )
    date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return "{} ({})".format(self.user.id, self.marketplace.id)


class Product(models.Model):
    """
    A product sold in a Marketplace.
    """

    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(
        max_digits=5, decimal_places=2, validators=[MinValueValidator(0)]
    )
    price_for_subscribers = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=None,
        null=True,
        blank=True,
    )
    image = models.ImageField()
    comment = models.TextField(null=True, blank=True)

    marketplace = models.ForeignKey(
        Marketplace, models.CASCADE, related_name="products"
    )

    number_left = models.IntegerField(
        default=-1,
        help_text="The number of products left."
        "By convention, -1 means unlimited products left.",
    )
    still_in_the_catalogue = models.BooleanField(default=True)

    # Can someone buy it on the site ? Ex : YES for Pain de Mine / NO for BDA
    orderable_online = models.BooleanField(default=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return "{} ({})".format(self.name, self.marketplace.id)


class Transaction(models.Model):
    """
    A Transaction links a product, a buyer, a quantity and a value (the overall value of the transaction, not of
    one copy of the product). It goes through several statuses during its lifetime.\n
    Transaction objects are also used to keep track of the spending of an user.\n
    The money should be considered spent when the status is ORDERED, VALIDATED or DELIVERED.\n
    The object should be considered gone from the marketplace stock once the order is VALIDATED.
    """

    id = models.AutoField(primary_key=True)

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="transactions"
    )
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    # Total value is remembered because the price might change, the product might be deleted, etc.
    value = models.DecimalField(max_digits=9, decimal_places=2)
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
        (
            "DELIVERED",
            "Transmis",
        ),  # The product has been given. The order cannot be CANCELLED then.
        (
            "REFUNDED",
            "Remboursé",
        ),  # The order has been delivered but it was faulty (or else), so it has been refunded.
    )
    status = models.CharField(choices=STATUS, max_length=200)

    @cached_property
    def value_in_balance(self):
        """
        :return True if the value of the transaction must be removed from their balance.
        """
        return self.status in ("ORDERED", "VALIDATED", "DELIVERED")

    class Meta:
        ordering = ["-id"]


class Funding(models.Model):
    """
    A Funding represents the action of topping a marketplace account up with some money.\n
    Only the marketplace managers should be able to create Funding objects and update their status.\n
    It should be added to their balance iff its status is FUNDED.
    """

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    value = models.DecimalField(
        max_digits=5, decimal_places=2, validators=[MinValueValidator(0)]
    )
    date = models.DateTimeField(auto_now=True)

    marketplace = models.ForeignKey(
        Marketplace, models.CASCADE, related_name="fundings"
    )

    STATUS = (("FUNDED", "Versé"), ("REFUNDED", "Remboursé"))
    status = models.CharField(choices=STATUS, max_length=200, default="FUNDED")

    class Meta:
        ordering = ["-id"]

    @cached_property
    def value_in_balance(self):
        """
        :return True if the value of the funding must be added to their balance.
        """
        return self.status == "FUNDED"
