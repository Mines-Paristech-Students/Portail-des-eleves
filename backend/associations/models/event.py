from django.db import models

from associations.models.association import Association
from authentication.models import User


class Event(models.Model):
    id = models.AutoField(primary_key=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)

    name = models.CharField(max_length=200)
    description = models.TextField()

    participants = models.ManyToManyField(User, related_name="events", default=[])

    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()

    place = models.TextField()

    class Meta:
        ordering = ["-id"]
