from django.db import models

from associations.models.association import Association
from authentication.models import User


class Event(models.Model):
    id = models.AutoField(primary_key=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)

    name = models.CharField(max_length=200)
    description = models.TextField()

    participants = models.ForeignKey(User, on_delete=models.CASCADE)

    starts_at = models.DateTimeField(auto_now_add=True)
    ends_at = models.DateTimeField(auto_now_add=True)
