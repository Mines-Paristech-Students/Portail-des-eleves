from django.db import models

from associations.models.association import Association


class Page(models.Model):
    id = models.AutoField(primary_key=True)

    title = models.CharField(max_length=200)
    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True, default=None)


class File(models.Model):
    id = models.AutoField(primary_key=True)

    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    file = models.FileField()
