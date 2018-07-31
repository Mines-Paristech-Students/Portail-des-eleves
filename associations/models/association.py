from django.db import models
from django.utils.text import slugify

from associations.models.marketplace import Marketplace
from associations.models.library import Library
from associations.models.publication import Publication
from authentication.models import User


class Association(models.Model):

    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200)

    logo = models.ImageField(upload_to="associations/logos/", null=True)

    market = models.OneToOneField(Marketplace, on_delete=models.DO_NOTHING)
    library = models.OneToOneField(Library, on_delete=models.DO_NOTHING)
    publication = models.OneToOneField(Publication, on_delete=models.DO_NOTHING)

    is_hidden_1A = models.BooleanField(default=False, verbose_name="Cachée aux 1A")
    rank = models.IntegerField(default=0,
                               help_text="Ordre d'apparition dans la liste des associations (ordre alphabétique pour les valeurs égales)")

    def _get_unique_slug(self):
        slug = slugify(self.name)
        unique_slug = slug
        num = 1
        while Association.objects.filter(slug=unique_slug).exists():
            unique_slug = '{}-{}'.format(slug, num)
            num += 1
        return unique_slug

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self._get_unique_slug()
        super().save(*args, **kwargs)


class Group(models.Model):
    id = models.AutoField(primary_key=True)

    members = models.ManyToManyField(User, blank=True)

    is_admin_group = models.BooleanField(default=False)

    # has editing rights on :
    static_page = models.BooleanField(default=False)
    news = models.BooleanField(default=False)
    marketplace = models.BooleanField(default=False)
    library = models.BooleanField(default=False)
    vote = models.BooleanField(default=False)
    events = models.BooleanField(default=False)
