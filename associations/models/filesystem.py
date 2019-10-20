from django.conf.global_settings import MEDIA_ROOT
from django.core.files.storage import FileSystemStorage
from django.db import models

from associations.models.association import Association
from authentication.models import User

fs = FileSystemStorage(location=MEDIA_ROOT)


class Folder(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=250)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, related_name="children", null=True
    )

    def number_of_elements(self):
        res = self.files.count()

        for c in self.children.all():
            res += c.number_of_elements()

        return res


class File(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=250)
    description = models.TextField(null=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    file = models.FileField(storage=fs)
    folder = models.ForeignKey(
        Folder, on_delete=models.CASCADE, related_name="files", null=True
    )

    uploaded_on = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
