from django.db import models

from associations.models.association import Association
from authentication.models import User


class News(models.Model):
    id = models.AutoField(primary_key=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    date = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=200, blank=True, null=True, default=None)
    text = models.TextField(blank=True, null=True, default=None)

    class Meta:
        ordering = ['-date']


class NewsPhoto(models.Model):
    id = models.AutoField(primary_key=True)

    news = models.ForeignKey(News, on_delete=models.CASCADE)
    photo = models.ImageField()
