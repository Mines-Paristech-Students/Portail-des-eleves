from datetime import date

from django.db import models
from smart_selects.db_fields import ChainedForeignKey

from authentication.models import User


class Poll(models.Model):
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
        blank=True,
        null=True,
    )

    # A comment about the poll from the administrator.
    admin_comment = models.TextField(
        verbose_name='commentaire administrateur',
        blank=True,
    )

    def has_been_published(self):
        """
        Return True if the poll is has been published in the past, that is publication_date_time <= now(),
        and its state is ACCEPTED.
        """
        td = date.today()
        if self.publication_date is None or self.state != 'ACCEPTED':
            return False
        return self.publication_date <= td

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
    )

    # The user who voted
    user = models.ForeignKey(
        User,
        verbose_name='utilisateur',
        on_delete=models.CASCADE
    )

    # The choice
    # ChainedForeignKey restrict the choice variable to have its 'poll' field equals to the vote 'poll' field
    choice = ChainedForeignKey(
        Choice,
        verbose_name='choix',
        on_delete=models.CASCADE,
        chained_field="poll",
        chained_model_field="poll",
        show_all=False,
        auto_choose=False,
        sort=False
    )

    class Meta:
        unique_together = ('poll', 'user')

    def __str__(self):
        return str(self.choice)
