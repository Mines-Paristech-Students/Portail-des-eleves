import io
import os
import pathlib

import magic
from PIL import Image
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from pdf2image import convert_from_path

from associations.models.association import Association
from authentication.models import User
from backend.settings import MEDIA_ROOT, MEDIA_URL

fs = FileSystemStorage(location=os.path.join(MEDIA_ROOT, "associations"))


class Media(models.Model):
    id = models.AutoField(primary_key=True)

    name = models.CharField(max_length=250)
    mimetype = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)

    association = models.ForeignKey(Association, on_delete=models.CASCADE)
    file = models.FileField(storage=fs)
    preview = models.FileField(storage=fs, null=True)

    uploaded_on = models.DateTimeField(auto_now=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ["name"]

    @property
    def url(self):
        return MEDIA_URL + "associations/" + self.file.name

    @property
    def preview_url(self):
        return MEDIA_URL + "associations/" + self.preview.name if self.preview else None

    def delete(self, using=None, keep_parents=False):
        self.file.delete()
        self.preview.delete()
        super().delete()


@receiver(post_save, sender=Media)
def create_preview(sender, instance: Media, created, **kwargs):
    if not created or not instance.file:
        return

    mime = magic.Magic(mime=True)
    instance.mimetype = mime.from_file(instance.file.path)

    if instance.mimetype.startswith("image"):
        with io.BytesIO() as output:
            filename = pathlib.Path(instance.file.name)
            extension = filename.suffix[1:].upper()

            if extension == "JPG":
                extension = "JPEG"

            image = Image.open(instance.file.path)
            image.thumbnail((300, 300))
            image.save(output, format=extension)
            instance.preview.save(
                os.path.splitext(filename.name)[0] + "_preview" + filename.suffix,
                ContentFile(output.getvalue()),
            )

            instance.save()

    elif instance.mimetype == "application/pdf":
        with io.BytesIO() as output:
            filename = pathlib.Path(instance.file.name)

            preview_name = os.path.splitext(filename.name)[0] + "_preview.png"

            image = convert_from_path(instance.file.path, last_page=1)[0]
            image.thumbnail((800, 800))
            image.save(output, format="PNG")
            instance.preview.save(preview_name, ContentFile(output.getvalue()))

            instance.save()
