from django.db import models

from authentication.models import User
from associations.models import Association

class Widget(models.Model):
    """Represent a widget on the frontend like chat, polls or birthdays
    The backend doesn't really care about whether or not the user want those widgets to be displayed
    or not. This model is used as a database-stored-enum and to be used as a foreign key to store
    widgetssubscriptions in the database"""
    name = models.CharField(
        primary_key=True,
        verbose_name='Nom du widget',
        max_length=30,
    )

    def __str__(self):
        return str(self.name)


class WidgetSubscription(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name='Utilisateur',
        on_delete=models.CASCADE,
        null=False,
        related_name='widget_subscriptions'
    )

    widget = models.ForeignKey(
        Widget,
        verbose_name='Widget',
        on_delete=models.CASCADE,
        null=False
    )

    displayed = models.BooleanField(
        verbose_name="Affiché"
    )

    class Meta:
        unique_together = ('user', 'widget')

    def __str__(self):
        return str(self.user) + ":" + str(self.widget)

class AssociationSubscription(models.Model):
    user = models.ForeignKey(
        User,
        verbose_name='Utilisteur',
        on_delete=models.CASCADE,
        null=False,
        related_name='association_subscription'
    )

    association = models.ForeignKey(
        Association,
        verbose_name='Association',
        on_delete=models.SET_NULL,
        null=True,
    )

    subscribed = models.BooleanField(
        verbose_name="Souscris"
    )

    class Meta:
        unique_together = ('user', 'association')

    def __str__(self):
        return str(self.user) + ":" + str(self.association)
