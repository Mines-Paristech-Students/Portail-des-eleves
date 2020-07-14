from datetime import date

from django.db import models
from django.utils.functional import cached_property

from associations.models.association import Association
from authentication.models.user import User


class Role(models.Model):
    """Each Role links an user, an association, and a set of permissions inside this association.

    For each permission `xxx`, the boolean field `xxx_permission` can be set to grant or not the user the related
    permission.
    However, for security reasons, each field `xxx_permission` must be associated to a boolean property `xxx` which
    relies on `xxx_permission` but also checks `is_archived`. So `xxx` should be the field used for reading a
    permission.
    """

    PERMISSION_NAMES = (
        "administration",
        "election",
        "event",
        "media",
        "library",
        "marketplace",
        "page",
    )

    id = models.AutoField(primary_key=True)

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, related_name="roles"
    )

    association = models.ForeignKey(
        Association, on_delete=models.CASCADE, null=False, related_name="roles"
    )

    role = models.CharField(max_length=200, null=False, blank=True, default="")

    start_date = models.DateField(null=False, default=date.today)

    end_date = models.DateField(null=True, default=None)

    rank = models.IntegerField(
        default=0, help_text="Order of appearance in the members list (lowest first)."
    )

    # Permissions:
    administration_permission = models.BooleanField(default=False)
    election_permission = models.BooleanField(default=False)
    event_permission = models.BooleanField(default=False)
    media_permission = models.BooleanField(default=False)
    library_permission = models.BooleanField(default=False)
    marketplace_permission = models.BooleanField(default=False)
    page_permission = models.BooleanField(default=False)

    @cached_property
    def is_active(self):
        """"A role is active iff the start date is passed and there is no end date / the end date is not passed yet."""

        return date.today() >= self.start_date and (
            self.end_date is None or self.end_date > date.today()
        )

    @cached_property
    def administration(self):
        return self.administration_permission and self.is_active

    @cached_property
    def election(self):
        return self.election_permission and self.is_active

    @cached_property
    def event(self):
        return self.event_permission and self.is_active

    @cached_property
    def media(self):
        return self.media_permission and self.is_active

    @cached_property
    def library(self):
        return self.library_permission and self.is_active

    @cached_property
    def marketplace(self):
        return self.marketplace_permission and self.is_active

    @cached_property
    def page(self):
        return self.page_permission and self.is_active

    @cached_property
    def permissions(self):
        """Return the permissions in a string array."""
        return [
            permission_name
            for permission_name in self.PERMISSION_NAMES
            if getattr(self, permission_name)
        ]

    class Meta:
        ordering = ("rank", "user__last_name")

    def __str__(self):
        return self.user.id + "-" + self.association.id + "-" + self.role
