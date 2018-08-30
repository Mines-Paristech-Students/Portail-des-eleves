from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.text import slugify

from associations.models.marketplace import Marketplace
from associations.models.library import Library
from associations.models.publication import Publication
from authentication.models import User


class Group(models.Model):
    id = models.AutoField(primary_key=True)

    members = models.ManyToManyField(User, blank=True)
    role = models.CharField(max_length=200, null=True)

    is_admin_group = models.BooleanField(default=False)

    # has editing rights on :
    static_page = models.BooleanField(default=False)
    news = models.BooleanField(default=False)
    marketplace = models.BooleanField(default=False)
    library = models.BooleanField(default=False)
    vote = models.BooleanField(default=False)
    events = models.BooleanField(default=False)


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

    groups = models.ManyToManyField(Group, blank=True)

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


#@receiver(post_save, sender=Association)
#def create_favorites(sender, instance, created, **kwargs):
#    if created:
#        instance.marketplace = Marketplace.objects.create()
#        instance.library = Library.objects.create()
#        instance.save()
