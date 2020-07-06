from datetime import datetime, timezone

from django.db import models
from django.utils.functional import cached_property

from associations.models.association import Association
from authentication.models import User


class Election(models.Model):
    """The Election class allows to carry a ballot. It should always guarantee the anonymity of the voter."""

    association = models.ForeignKey(
        Association, on_delete=models.CASCADE, related_name="elections"
    )

    name = models.CharField(max_length=200)

    starts_at = models.DateTimeField(null=False)
    ends_at = models.DateTimeField(null=False)

    results_are_published = models.BooleanField(
        default=False,
        help_text="If `False`, results should not be published (even for the elections administrator).",
    )

    max_choices_per_ballot = models.PositiveIntegerField(
        default=1, help_text="The number of choices allowed per ballot."
    )

    class Meta:
        ordering = ["-id"]

    @cached_property
    def started(self):
        return self.starts_at <= datetime.now(tz=timezone.utc)

    @cached_property
    def is_active(self):
        return self.starts_at < datetime.now(tz=timezone.utc) < self.ends_at

    @cached_property
    def show_results(self):
        """Show the results iff the election is over and `results_are_published` are True."""
        return (
            datetime.now(tz=timezone.utc) > self.ends_at and self.results_are_published
        )


class Choice(models.Model):
    """Represents a choice in an election."""

    election = models.ForeignKey(
        Election, on_delete=models.CASCADE, related_name="choices"
    )

    name = models.CharField(max_length=200)

    number_of_offline_votes = models.PositiveIntegerField(default=0)
    number_of_online_votes = models.PositiveIntegerField(default=0)

    @cached_property
    def number_of_votes(self):
        return self.number_of_offline_votes + self.number_of_online_votes

    @cached_property
    def show_results(self):
        return self.election.show_results


class Voter(models.Model):
    """A Voter is an User which may vote to an Election. It may be in one of three states: PENDING (has not voted yet),
    ONLINE_VOTE (has voted online), OFFLINE_VOTE (has voted offline)."""

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    election = models.ForeignKey(
        Election, on_delete=models.CASCADE, related_name="voters"
    )

    STATUS = (
        ("PENDING", "PENDING"),
        ("ONLINE_VOTE", "ONLINE_VOTE"),
        ("OFFLINE_VOTE", "OFFLINE_VOTE"),
    )
    status = models.CharField(choices=STATUS, max_length=12, default="PENDING")

    class Meta:
        unique_together = ("user", "election")
