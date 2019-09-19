from collections import Counter
from datetime import datetime, timezone

from django.db import models
from django.utils.functional import cached_property

from associations.models.association import Association
from authentication.models import User


class Election(models.Model):
    """
        The Election class allows to carry a vote. It should always guarantee the anonymity of the voter.
    """

    id = models.AutoField(primary_key=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE, related_name='elections')

    name = models.CharField(max_length=200)

    registered_voters = models.ManyToManyField(User,
                                               related_name='allowed_elections',
                                               help_text='User who are allowed to vote to this election.')
    voters = models.ManyToManyField(User,
                                    related_name='voted_elections',
                                    help_text='People who have already voted to this election.')

    starts_at = models.DateTimeField(null=False)
    ends_at = models.DateTimeField(null=False)

    max_choices_per_vote = models.PositiveIntegerField(default=1,
                                                       help_text='The number of choices allowed per vote.')

    @cached_property
    def results(self):
        # First, we fetch all the votes, but by replacing them by the associated choice name.
        # We then wrap all of these choices into a Counter, which is a nice built-in object which will…
        # count the votes for us.
        return Counter([vote[0] for vote in self.votes.values_list('choices__name')])

    @cached_property
    def is_active(self):
        return self.starts_at < datetime.now(tz=timezone.utc) < self.ends_at


class Choice(models.Model):
    """
        Represents a choice in an election.
    """

    id = models.AutoField(primary_key=True)

    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='choices')
    name = models.CharField(max_length=200)


class Vote(models.Model):
    id = models.AutoField(primary_key=True)

    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='votes')
    choices = models.ManyToManyField(Choice, related_name='votes')

    @cached_property
    def is_valid(self):  # Should always be true
        return len(self.choices.count()) <= self.election.max_choices_per_vote
