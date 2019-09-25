from collections import Counter
from datetime import date, timedelta

from django.db import models
from django.utils.functional import cached_property

from authentication.models import User


class Poll(models.Model):
    POLL_LIFETIME = timedelta(days=1)
    
    # The question of the poll.
    question = models.CharField(
        verbose_name='question',
        max_length=200,
    )

    # The user who created the poll.
    user = models.ForeignKey(
        User,
        verbose_name='auteur',
        on_delete=models.SET_NULL,
        null=True,
        related_name='polls',
    )

    # The date of creation.
    creation_date_time = models.DateTimeField(
        verbose_name='date de création',
        auto_now_add=True,
    )

    # The state of the poll.
    STATES = (
        ('REVIEWING', 'Validation en cours'),
        ('REJECTED', 'Refusé'),
        ('ACCEPTED', 'Accepté')
    )
    state = models.CharField(
        verbose_name='état',
        max_length=9,
        choices=STATES,
        default='REVIEWING',
    )

    # The date of publication.
    publication_date = models.DateField(
        verbose_name='date de publication',
        null=True,
        default=None,
    )

    # A comment about the poll from the administrator.
    admin_comment = models.TextField(
        verbose_name='commentaire administrateur',
        blank=True,
        default='',
    )

    @cached_property
    def has_been_published(self):
        """
        Return True if the poll is has been published in the past, that is publication_date <= now(), and its state is
        ACCEPTED.
        """
        if self.publication_date is None or self.state != 'ACCEPTED':
            return False
        return self.publication_date <= date.today()

    @cached_property
    def is_active(self):
        return self.has_been_published and self.publication_date + self.POLL_LIFETIME > date.today()

    @cached_property
    def results(self):
        # First, we fetch all the ballots, but by replacing them by the associated choice name.
        # We then wrap all of these choices into a Counter, which is a nice built-in object which will
        # count the ballots for us.
        return Counter([vote[0] for vote in self.votes.values_list('choice__text')])

    def __str__(self):
        return self.question


class Choice(models.Model):
    # The text of the choice.
    text = models.CharField(
        verbose_name='texte du choix',
        max_length=200,
    )

    # The related poll.
    poll = models.ForeignKey(
        Poll,
        verbose_name='sondage',
        on_delete=models.CASCADE,
        related_name='choices',
    )

    def __str__(self):
        return self.text


class Vote(models.Model):
    # The related poll
    poll = models.ForeignKey(
        Poll,
        verbose_name='sondage',
        on_delete=models.CASCADE,
        related_name='votes'
    )

    # The user who voted
    user = models.ForeignKey(
        User,
        verbose_name='utilisateur',
        on_delete=models.CASCADE
    )

    # The choice
    choice = models.ForeignKey(
        Choice,
        verbose_name='choix',
        on_delete=models.CASCADE,
    )

    class Meta:
        unique_together = ('poll', 'user')

    def __str__(self):
        return str(self.choice)
