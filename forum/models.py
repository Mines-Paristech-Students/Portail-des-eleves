from django.db import models

from authentication.models import User

class Theme(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    is_hidden_1A = models.BooleanField(default=False, verbose_name="Caché aux 1A")

    def __str__(self):
        return self.name

class Topic(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    is_hidden_1A = models.BooleanField(default=False, verbose_name="Caché aux 1A")

    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, null=False)

    def __str__(self):
        return self.name

class MessageForum(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    up_vote = models.ManyToManyField(User, related_name='+')
    down_vote = models.ManyToManyField(User, related_name='+')

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, null=False)