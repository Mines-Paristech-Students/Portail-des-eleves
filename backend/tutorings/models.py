from django.db import models
from authentication.models import User
from django.utils.functional import cached_property


# Create your models here.

class Tutoring(models.Model):
    # The date of creation.
    publication_date = models.DateTimeField(
        verbose_name="date de publication", auto_now_add=True
    )

    name = models.CharField(verbose_name="nom élève", max_length=50)
    contact = models.CharField(max_length=50)
    place = models.CharField(max_length=200)
    subject = models.CharField(max_length=50)
    level = models.CharField(max_length=50)
    time_availability = models.CharField(max_length=200)
    frequency = models.CharField(max_length=200)
    description = models.TextField()

    # The state of the tutorings class.
    STATES = (
        ("REVIEWING", "Validation en cours"),
        ("ACCEPTED", "Accepté"),
    )

    # The user who is assigned to the tutorings class
    user = models.ForeignKey(User,
                             verbose_name="papseur",
                             on_delete=models.CASCADE,
                             null=True,
                             default=None,
                             )
    state = models.CharField(choices=STATES, verbose_name="état", max_length=9, default="REVIEWING")

    # A comment about the tutorings from the administrator.
    admin_comment = models.TextField(
        verbose_name="commentaire administrateur", blank=True, default=""
    )

    @cached_property
    def is_active(self):
       return self.state == "ACCEPTED"

    @cached_property
    def is_assigned(self):
        for application in self.applications.all():
            if application.state == "ACCEPTED":
                return True
        return False


class ApplyTutor(models.Model):
    tutoring = models.ForeignKey(Tutoring, related_name="applications", verbose_name="paps", on_delete=models.CASCADE)

    # The user who papsed

    user = models.ForeignKey(User,
                             verbose_name="papseur",
                             on_delete=models.SET_NULL,
                             null=True,
                             )
    paps_time = models.DateTimeField(
        verbose_name="moment du paps", auto_now_add=True
    )

    STATES = (
        ("REVIEWING", "Validation en cours"),
        ("ACCEPTED", "Accepté"),
    )

    state = models.CharField(choices=STATES, verbose_name="état", max_length=9, default="REVIEWING")

    class Meta:
        unique_together = ("tutoring", "user")
