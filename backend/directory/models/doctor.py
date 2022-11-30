import uuid

from django.db import models


class Doctor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=250)
    address = models.CharField(max_length=250)
    phone = models.CharField(max_length=15, null=True, blank=True)
    fee = models.IntegerField(null=True, blank=True)
