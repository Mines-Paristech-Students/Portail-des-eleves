from django.core.files.storage import FileSystemStorage
from django.db import models

from associations.models.association import Association
from authentication.models import User

fs = FileSystemStorage(location='/medias/uploads/associations')

class Folder(models.Model):
    id = models.AutoField(primary_key=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, related_name="children")

class File(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=250)
    description = models.TextField()

    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    file = models.FileField(Association, on_delete=models.CASCADE)
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE, related_name="files")

    uploaded_on = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(User)
