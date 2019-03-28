from django.db import models

class Repartition(models.Model):
    id = models.AutoField(primary_key=True)

    title = models.CharField(max_length=200)
    promotion = models.CharField(max_length=20)
    status = models.IntegerField()