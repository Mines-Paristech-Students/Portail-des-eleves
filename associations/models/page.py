from django.db import models

from associations.models.association import Association

class Page(models.Model):
    id = models.AutoField(primary_key=True)

    title = models.CharField(max_length=200)
    association = models.ForeignKey(Association, on_delete=models.CASCADE, related_name="pages")
    text = models.TextField(blank=True, null=True, default=None)
