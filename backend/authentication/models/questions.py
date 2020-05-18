from django.db import models

from authentication.models import User


class ProfileQuestion(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=255)

    class Meta:
        ordering = ["-id"]


class ProfileAnswer(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=255)

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, related_name="profile_answers"
    )

    question = models.ForeignKey(ProfileQuestion, on_delete=models.CASCADE, null=False)

    class Meta:
        unique_together = ("user", "question")
        ordering = ["-id"]
