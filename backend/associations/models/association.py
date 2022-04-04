from django.core.files.storage import FileSystemStorage
from django.db import models
from django.utils.functional import cached_property
from django.utils.text import slugify

from associations.models.library import Library
from associations.models.marketplace import Marketplace
from backend.settings import MEDIA_ROOT

fs = FileSystemStorage(location=MEDIA_ROOT)


class Association(models.Model):
    id = models.SlugField(max_length=200, primary_key=True)
    name = models.CharField(max_length=200)

    logo = models.ForeignKey(
        "Media",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="logo_of",
    )

    marketplace = models.OneToOneField(
        Marketplace,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="association",
    )
    library = models.OneToOneField(
        Library,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name="association",
    )

    is_hidden = models.BooleanField(default=False)
    rank = models.IntegerField(
        default=0,
        help_text="Order of appearance in the association list (lowest first).",
    )

    @cached_property
    def marketplace_enabled(self):
        return self.marketplace is not None and self.marketplace.enabled

    @cached_property
    def library_enabled(self):
        return self.library is not None and self.library.enabled

    @cached_property
    def enabled_modules(self):
        return [
            module
            for module in ("marketplace", "library")
            if getattr(self, f"{module}_enabled")
        ]

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
        return str(self.name)

    class Meta:
        ordering = ["rank", "name"]
