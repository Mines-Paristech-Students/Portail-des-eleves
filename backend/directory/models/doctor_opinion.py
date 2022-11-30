import uuid

from django.db import models

from authentication.models import User
from directory.models import Doctor


class DoctorOpinion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    doctor = models.ForeignKey(
        Doctor, related_name="opinions", on_delete=models.CASCADE
    )
    user = models.ForeignKey(User, related_name="opinions", on_delete=models.CASCADE)
    is_anonymous = models.BooleanField(default=False)
    reason_for_consultation = models.CharField(max_length=250, null=True, blank=True)
    comment = models.CharField(max_length=1000)
