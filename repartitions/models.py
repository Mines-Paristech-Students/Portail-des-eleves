from django.db import models
from authentication.models import User

class Repartition(models.Model):
    id = models.AutoField(primary_key=True)

    title = models.CharField(max_length=200)
    promotion = models.CharField(max_length=20)
    status = models.IntegerField()
    equirepartition = models.BooleanField(default=True)

class Proposition(models.Model):
    id = models.AutoField(primary_key=True)

    campagne = models.ForeignKey(Repartition, on_delete=models.CASCADE)
    nom = models.CharField(max_length=200, blank=True, null=True, default=None)
    num = models.IntegerField()

    min_eleves = models.IntegerField()
    max_eleves = models.IntegerField()

class Voeux(models.Model):
    id = models.AutoField(primary_key=True)

    campagne = models.ForeignKey(Repartition, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    voeux = models.TextField()
    isNew = models.BooleanField(default=True)
    outcome = models.IntegerField(default=-1)