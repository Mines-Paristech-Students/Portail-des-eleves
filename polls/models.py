from datetime import date

from django.db import models

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


class Choice(models.Model):
    # The text of the choice.
    text = models.CharField(
        veborse_name='texte du choix',
        max_length=200,
    )

    # The related poll.
    poll = models.ForeignKey(
        Poll,
        verbose_name='sondage',
        on_delete=models.CASCADE,
        related_name='choices',
    )
