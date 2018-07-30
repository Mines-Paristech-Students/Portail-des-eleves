import datetime
from django.db import models

from associations.models import Association
from authentication.models import User


class News(models.Model):

    class Meta:
        app_label = "association"

    title = models.CharField(max_length=200, blank=True, null=True, default=None)
    date = models.DateTimeField(default=datetime.now())
    author = models.ForeignKey(User, blank=True, null=True, default=None)

    association = models.ForeignKey(Association, on_delete=models.CASCADE())
    text = models.TextField(blank=True, null=True, default=None)


class NewsPhoto(models.Model):

    class Meta:
        app_label = "association"

    news = models.ForeignKey(News, on_delete=models.CASCADE)
    photo = models.ImageField()
