from django.db import models
from authentication.models import User


class Campaign(models.Model):
    """ Represents one repartition between a set of user and propositions. It's the 'mother' model object """

    STATUS = ("CLOSED", "OPEN", "RESULTS")

    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=200)
    status = models.CharField(max_length=200, default="CLOSED")
    manager = models.ForeignKey(User, on_delete=models.DO_NOTHING)

    class Meta:
        ordering = ["-id"]


class Category(models.Model):
    """ Represents a particular subset of users to be distributed between propositions. The users will be evenly
    distributed inside categories """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)

    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name="categories"
    )


class Proposition(models.Model):
    """ Represents a possible choice for a user, such as a particular group """

    id = models.AutoField(primary_key=True)

    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name="propositions"
    )
    name = models.CharField(max_length=200)
    # number_of_places = models.IntegerField()  # Fixme: not supported by the algorithm


class Group(models.Model):
    """ Represents a subset of users that are assigned to a particular proposition by the algorithm """

    id = models.AutoField(primary_key=True)
    proposition = models.ForeignKey(Proposition, on_delete=models.CASCADE)
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE, related_name="groups"
    )


class UserCampaign(models.Model):
    """ Bridge between the user and the campaign. It gathers the choices of the users, if they must be assigned to a
    group in particular, and the group they were assigned to """

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    campaign = models.ForeignKey(Campaign, on_delete=models.DO_NOTHING)

    category = models.ForeignKey(
        Category, on_delete=models.DO_NOTHING, related_name="users_campaign"
    )
    fixed_to = models.ForeignKey(Proposition, on_delete=models.DO_NOTHING, null=True)
    group = models.ForeignKey(
        Group, on_delete=models.DO_NOTHING, related_name="users", blank=True, null=True
    )

    class Meta:
        unique_together = (("user", "campaign"),)
        ordering = ["-id"]


class Wish(models.Model):
    """ Represents the classification for a wish by a user """

    id = models.AutoField(primary_key=True)

    user_campaign = models.ForeignKey(
        UserCampaign, on_delete=models.CASCADE, related_name="wishes"
    )
    proposition = models.ForeignKey(Proposition, on_delete=models.CASCADE)
    rank = models.IntegerField()
