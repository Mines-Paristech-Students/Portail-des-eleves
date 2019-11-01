from django.db import models
from authentication.models import User


class ChatMessage(models.Model):
    """
    Represents a chat entry in the database
    """

    # Fields
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

    class Meta:
        ordering = ["-id"]
