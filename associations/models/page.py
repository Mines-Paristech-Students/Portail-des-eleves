from django.db import models


class Page(models.Model):

    class Meta:
        app_label = "association"

    title = models.CharField(max_length=200)
    association = models.ForeignKey(Association, on_delete=models.CASCADE())
    text = models.TextField(blank=True, null=True, default=None)


class File(models.Model):

    class Meta:
        app_label = "association"

    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    file = models.FileField()
