from django.core.files.storage import FileSystemStorage
from django.db import models

from associations.models.association import Association
from authentication.models import User
from backend.settings import MEDIA_ROOT

fs = FileSystemStorage(location=MEDIA_ROOT)


class Media(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    file = models.FileField(storage=fs)

    uploaded_on = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ["name"]
