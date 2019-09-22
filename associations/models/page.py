from django.db import models

from associations.models import Association
from authentication.models import User


class Page(models.Model):
    id = models.AutoField(primary_key=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE, related_name="pages")
    authors = models.ManyToManyField(User)

    creation_date = models.DateTimeField(auto_now_add=True)
    last_update_date = models.DateTimeField(auto_now=True)

    title = models.CharField(max_length=200)
    text = models.TextField(blank=True, default='')

    NEWS = 'NEWS'
    """A Page which will be displayed in the news feed of the association."""

    STATIC = 'STATIC'
    """A Page which can be accessed from the association main page."""

    PAGE_TYPES = (
        (NEWS, 'News page'),
        (STATIC, 'Static page')
    )

    page_type = models.CharField(choices=PAGE_TYPES, blank=False, default=STATIC, max_length=6)
