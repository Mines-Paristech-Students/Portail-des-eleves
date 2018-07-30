from django.db import models

from associations.models.association import Association
from authentication.models import User


class News(models.Model):

    title = models.CharField(max_length=200, blank=True, null=True, default=None)
    date = models.DateTimeField(auto_now = True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True, default=None)


class NewsPhoto(models.Model):

    news = models.ForeignKey(News, on_delete=models.CASCADE)
    photo = models.ImageField()
