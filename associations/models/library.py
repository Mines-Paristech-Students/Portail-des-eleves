from django.db import models

from authentication.models import User


class Library(models.Model):
    """
        Provides an interface to lend objects to people and to follow who has what
    """

    class Meta:
        app_label = "association"


class Object(models.Model):

    class Meta:
        app_label = "association"

    name = models.CharField(max_length=200)
    description = models.TextField(null=True)
    image = models.ImageField()
    comment = models.TextField()

    library = models.ForeignKey(Library, models.CASCADE)

    # By convention, -1 = unlimited number of this product.
    number_left = models.PositiveIntegerField(default=1)
    still_in_the_catalogue = models.BooleanField(default=True)

    # Can someone buy it on the site ? Ex : YES for Pain de Mine / NO for biéro
    orderable_online = models.BooleanField(default=True)


class Loan(models.Model):

    class Meta:
        app_label = "association"

    object = models.OneToOneField(Object)
    user = models.OneToOneField(User)

    loan_date = models.DateTimeField(auto_now=True)
    expected_return_date = models.DateTimeField(auto_now=False, null=True)
    real_return_date = models.DateTimeField(auto_now=False, null=True)

    STATUS = (
        ("ORDERED", "Commandé"),  # The buyer passed the purchase order
        ("VALIDATED", "Validé"),  # The seller confirms it can honor the request
        ("DELIVERED", "Délivré"),  # The product has been given. The order cannot be CANCELLED then
        ("CANCELLED", "Annulé"),  # The buyer cancels the order
        ("RETURNED", "Rendu"),  # The buyer cancels the order
    )
    status = models.CharField(choices=STATUS)
