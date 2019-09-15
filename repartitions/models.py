from django.db import models
from authentication.models import User


class Campaign(models.Model):
    STATUS = ("CLOSED", "OPEN", "RESULTS")

    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=200)
    status = models.CharField(max_length=200, default="CLOSED")
    even = models.BooleanField(default=True)  # should  all the categories be evenly split between groups
    manager = models.ForeignKey(User, on_delete=models.DO_NOTHING)


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="categories")


class Proposition(models.Model):
    id = models.AutoField(primary_key=True)

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=True, null=True, default=None)
    number_of_places = models.IntegerField()


class UserCampaign(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    campaign = models.ForeignKey(Campaign, on_delete=models.DO_NOTHING)

    category = models.ForeignKey(Category, on_delete=models.DO_NOTHING, related_name="users_campaign")
    fixed_to = models.ForeignKey(Proposition, on_delete=models.DO_NOTHING, null=True)

    class Meta:
        unique_together = (('user', 'campaign'),)


class Wish(models.Model):
    id = models.AutoField(primary_key=True)

    user_campaign = models.ForeignKey(UserCampaign, on_delete=models.CASCADE, related_name="wishes")
    proposition = models.ForeignKey(Proposition, on_delete=models.CASCADE)
    rank = models.IntegerField()
