from django.db import models
from django.utils.text import slugify

from associations.models.library import Library
from associations.models.marketplace import Marketplace
from associations.models.publication import Publication
from authentication.models import User


class Association(models.Model):
    id = models.SlugField(max_length=200, primary_key=True)
    name = models.CharField(max_length=200)

    logo = models.ImageField(upload_to="associations/logos/", null=True)

    marketplace = models.OneToOneField(Marketplace, on_delete=models.DO_NOTHING, null=True, related_name="association")
    library = models.OneToOneField(Library, on_delete=models.DO_NOTHING, null=True)
    publication = models.OneToOneField(Publication, on_delete=models.DO_NOTHING, null=True)

    is_hidden_1A = models.BooleanField(default=False, verbose_name="Cachée aux 1A")
    rank = models.IntegerField(default=0,
                               help_text="Ordre d'apparition dans la liste des associations (ordre alphabétique pour les valeurs égales)")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def _get_unique_slug(self):
        slug = slugify(self.name)
        unique_slug = slug
        num = 1
        while Association.objects.filter(id=unique_slug).exists():
            unique_slug = '{}-{}'.format(slug, num)
            num += 1
        return unique_slug

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self._get_unique_slug()
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.id)


class Role(models.Model):
    id = models.AutoField(primary_key=True)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        related_name="roles"
    )
    association = models.ForeignKey(
        Association,
        on_delete=models.CASCADE,
        null=False,
        related_name="roles"
    )
    role = models.CharField(max_length=200, null=False)
    rank = models.IntegerField(
        default=0, help_text="Ordre d'apparition dans la liste des membres de l'asso (ordre alphabétique pour les valeurs égales)"
    )

    is_admin = models.BooleanField(default=False)
    is_archived = models.BooleanField(default=False) # archived permissions are not operating anymore but they allow to remember who was in the association
    # Permissions:

    static_page = models.BooleanField(default=False)
    news = models.BooleanField(default=False)
    marketplace = models.BooleanField(default=False)
    library = models.BooleanField(default=False)
    vote = models.BooleanField(default=False)
    events = models.BooleanField(default=False)
    files = models.BooleanField(default=False)

    class Meta:
        unique_together = ("user", "association")
        ordering = ['rank']

    def __str__(self):
        return self.user.id + "-" + self.association.id + "-" + self.role
