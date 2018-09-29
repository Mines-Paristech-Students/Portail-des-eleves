from django.db import models


class Publication(models.Model):
    """
        Provides an interface to publish files on a regular basis
    """


class Edition(models.Model):
    class Meta:
        app_label = "association"
        db_table = "association_publication_edition"

    name = models.CharField(max_length=200)
    date = models.DateTimeField(auto_now=True)
    number = models.IntegerField()
    file = models.FileField()
    thumbnail = models.ImageField()

    publication = models.ForeignKey(Publication, models.CASCADE)
