from django.db import models
from django.utils.functional import cached_property

from authentication.models import User


class Theme(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name


class Topic(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, null=False)

    def __str__(self):
        return self.name


class MessageForum(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    up_votes = models.ManyToManyField(User, related_name="upvoted_messages")
    down_votes = models.ManyToManyField(User, related_name="downvoted_messages")

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, null=False)

    @cached_property
    def nb_up_votes(self):
        return self.up_votes.count()

    @cached_property
    def nb_down_votes(self):
        return self.down_votes.count()

    @cached_property
    def up_votes_ratio(self):
        total = self.up_votes.count() + self.down_votes.count()

        return self.up_votes.count() / total if total > 0 else 0
