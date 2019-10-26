from django.db import models

from associations.models.association import Association


class Page(models.Model):
    id = models.AutoField(primary_key=True)

    association = models.ForeignKey(
        Association, on_delete=models.CASCADE, related_name="pages"
    )

    title = models.CharField(max_length=200)
    text = models.TextField(blank=True, default="")
