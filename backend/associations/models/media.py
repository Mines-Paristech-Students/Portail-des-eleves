import io
import os
import pathlib
import platform

import magic
from PIL import Image
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.db import models
from pdf2image import convert_from_path
from django.db.models.signals import post_save
from django.dispatch import receiver

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

    instance.mimetype = find_mime_type(instance.file.path)

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


def find_mime_type(path):
    # The magic file is auto-discovered on Unix based OS.
    # On Windows, both Magic file versions may be used, depending on your dependencies.
    # Àou also need to download Poppler: https://github.com/oschwartz10612/poppler-windows/releases/tag/v0.89.0-patched
    # Put it somewhere on your system and create a PATH environment variable linking to the `bin` folder.
    # Don't forget to reboot Windows afterwards.
    if platform.system() == "Windows":
        try:
            mime = magic.Magic(magic_file="magic_v14.mgc", mime=True)
        except magic.MagicException:
            mime = magic.Magic(magic_file="magic_v12.mgc", mime=True)
    else:
        mime = magic.Magic(mime=True)

    return mime.from_file(path)
