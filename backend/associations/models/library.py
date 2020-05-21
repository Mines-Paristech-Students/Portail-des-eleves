from django.db import models

from authentication.models import User


class Library(models.Model):
    """
        Provides an interface to lend objects to people and to follow who has what
    """

    id = models.SlugField(max_length=200, primary_key=True)
    enabled = models.BooleanField(default=False)

    class Meta:
        ordering = ["-id"]


class Loanable(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(null=True)
    comment = models.TextField(null=True, blank=True)
    library = models.ForeignKey(Library, models.CASCADE, related_name="loanables")

    class Meta:
        ordering = ["-id"]

    def is_borrowed(self):
        for loan in self.loans.all():
            if loan.status == "BORROWED":
                return True

        return False

    def is_available(self):
        for loan in self.loans.all():
            if loan.status in ["BORROWED", "ACCEPTED"]:
                return False
        return True

    def get_expected_return_date(self):
        loans = Loan.objects.filter(
            loanable=self, status__in=["BORROWED", "ACCEPTED"]
        ).order_by("-id")
        return loans[0].expected_return_date if len(loans) > 0 else None


class Loan(models.Model):
    id = models.AutoField(primary_key=True)

    loanable = models.ForeignKey(
        Loanable, on_delete=models.CASCADE, related_name="loans"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    loan_date = models.DateTimeField(auto_now=False, null=True)
    expected_return_date = models.DateTimeField(auto_now=False, null=True)
    real_return_date = models.DateTimeField(auto_now=False, null=True)

    #           --- CANCELLED
    #          /
    # PENDING ----- ACCEPTED ------ BORROWED ----- RETURNED
    #          \
    #           --- REJECTED

    STATUS = (
        ("PENDING", "En attente"),  # The user has asked for the loan.
        ("CANCELLED", "Annulé"),  # The user has cancelled the loan.
        ("REJECTED", "Refusé"),  # The library administrator has refused the loan.
        ("ACCEPTED", "Accepté"),  # The library administrator has accepted the loan.
        (
            "BORROWED",
            "Emprunté",
        ),  # The product has been given. The order cannot be CANCELLED anymore.
        ("RETURNED", "Rendu"),  # The product has been returned.
    )
    status = models.CharField(choices=STATUS, max_length=200, default="PENDING")

    class Meta:
        ordering = ["-id"]
