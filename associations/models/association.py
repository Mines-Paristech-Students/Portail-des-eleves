from django.db import models
from django.utils.functional import cached_property
from django.utils.text import slugify

from associations.models.library import Library
from associations.models.marketplace import Marketplace
from authentication.models import User
from tags.manager import TagFilterableManager


class Association(models.Model):
    id = models.SlugField(max_length=200, primary_key=True)
    name = models.CharField(max_length=200)

    logo = models.ImageField(upload_to="associations/logos/", null=True, default=None)

    marketplace = models.OneToOneField(
        Marketplace,
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        related_name="association",
    )
    library = models.OneToOneField(
        Library,
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        related_name="association",
    )

    is_hidden = models.BooleanField(default=False)
    rank = models.IntegerField(
        default=0,
        help_text="Order of appearance in the association list (lowest first).",
    )

    objects = TagFilterableManager()

    def _get_unique_slug(self):
        slug = slugify(self.name)
        unique_slug = slug
        num = 1
        while Association.objects.filter(id=unique_slug).exists():
            unique_slug = "{}-{}".format(slug, num)
            num += 1
        return unique_slug

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self._get_unique_slug()
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.id)

    class Meta:
        ordering = ["rank", "name"]


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
        "events",
        "filesystem",
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
    rank = models.IntegerField(
        default=0, help_text="Order of appearance in the members list (lowest first)."
    )

    is_archived = models.BooleanField(
        default=False,
        help_text="Archived roles are not operating anymore but they allow to remember "
        "who was in the association.",
    )

    # Permissions:
    administration_permission = models.BooleanField(default=False)
    election_permission = models.BooleanField(default=False)
    events_permission = models.BooleanField(default=False)
    filesystem_permission = models.BooleanField(default=False)
    library_permission = models.BooleanField(default=False)
    marketplace_permission = models.BooleanField(default=False)
    page_permission = models.BooleanField(default=False)

    @cached_property
    def administration(self):
        return self.administration_permission and not self.is_archived

    @cached_property
    def election(self):
        return self.election_permission and not self.is_archived

    @cached_property
    def events(self):
        return self.events_permission and not self.is_archived

    @cached_property
    def filesystem(self):
        return self.filesystem_permission and not self.is_archived

    @cached_property
    def library(self):
        return self.library_permission and not self.is_archived

    @cached_property
    def marketplace(self):
        return self.marketplace_permission and not self.is_archived

    @cached_property
    def page(self):
        return self.page_permission and not self.is_archived

    class Meta:
        unique_together = ("user", "association")
        ordering = ("rank", "user__last_name")

    def __str__(self):
        return self.user.id + "-" + self.association.id + "-" + self.role
