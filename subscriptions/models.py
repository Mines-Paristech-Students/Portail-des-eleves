from django.db import models

from authentication.models import User
from associations.models import Association


class WidgetSubscription(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=False, related_name="widget_subscriptions"
    )

    payload = models.TextField(blank=True, null=True)
