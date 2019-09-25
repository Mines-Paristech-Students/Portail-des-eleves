from django.db import models

from associations.models import (
    File,
    Product,
    Loanable,
    Event,
    Page,
    Choice,
    Role,
    Folder,
    Loan,
    Association,
)
from forum.models import Theme, Topic, MessageForum


class Namespace(models.Model):
    class Meta:
        unique_together = (("name", "scope", "scoped_to"),)

    SCOPES = {"association": Association, "forum_theme": Theme, "global": None}

    name = models.CharField(max_length=50)

    scope = models.CharField(max_length=50)  # The application it targets
    scoped_to = models.CharField(
        max_length=50, blank=True, null=True
    )  # The id of the mother instance in the application

    def __str__(self):
        return "Namespace name={} scope={} scoped_to={}".format(
            self.name, self.scope, self.scoped_to
        )


class Tag(models.Model):
    LINKS = {
        # Association
        "association": Association,
        "choice": Choice,
        "event": Event,
        "file": File,
        "folder": Folder,
        "loan": Loan,
        "loanable": Loanable,
        "page": Page,
        "product": Product,
        "role": Role,
        # Forum
        "theme": Theme,
        "topic": Topic,
        "message_forum": MessageForum,
    }

    namespace = models.ForeignKey(
        Namespace, related_name="tags", on_delete=models.CASCADE
    )

    value = models.CharField(max_length=50)
    url = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        unique_together = (("value", "namespace"),)


# Dynamically adds the needed fiields to the tag
for (link_name, link_class) in Tag.LINKS.items():
    field = models.ManyToManyField(link_class, related_name="tags")
    field.contribute_to_class(Tag, link_name)
