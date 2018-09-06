from django.db import models
from django.utils import timezone

from authentication.models import User


class Poll(models.Model):
    # The question of the poll.
    question = models.CharField(
        'question',
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
        'date de création',
        auto_now_add=True,
    )

    # The state of the poll.
    STATES = (
        ('REVIEWING', 'Validation en cours'),
        ('REJECTED', 'Refusé'),
        ('ACCEPTED', 'Accepté')
    )
    state = models.CharField(
        'état',
        max_length=9,
        choices=STATES,
        default='REVIEWING',
    )

    # The date of publication.
    publication_date_time = models.DateTimeField(
        'date de publication',
        blank=True,
        null=True,
    )

    # The end of publication.
    publication_end_date_time = models.DateTimeField(
        'date de fin de publication',
        blank=True,
        null=True,
    )

    # A comment about the poll from the administrator.
    admin_comment = models.TextField(
        'commentaire administrateur',
        blank=True,
    )

    def is_published(self):
        """
        Return True if the poll is currently published, that is publication_date_time <= now() <=
        publication_date_time + duration, and its state is ACCEPTED.
        """
        now = timezone.now()
        if self.publication_date_time is None or self.publication_end_date_time is None:
            return False
        else:
            return self.state == 'ACCEPTED' and self.publication_date_time <= now <= self.publication_end_date_time

    is_published.short_description = 'publié ?'
    is_published.boolean = True
    is_published.admin_order_field = 'publication_date_time'


class Choice(models.Model):
    # The text of the choice.
    text = models.CharField(
        'texte du choix',
        max_length=200,
    )

    # The related poll.
    poll = models.ForeignKey(
        Poll,
        verbose_name='sondage',
        on_delete=models.CASCADE,
        related_name='choices',
    )
