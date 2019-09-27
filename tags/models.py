from django.core.exceptions import ObjectDoesNotExist
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
from tags.exceptions import BrokenTagLink


class Namespace(models.Model):
    class Meta:
        unique_together = ("name", "scope", "scoped_to")

    SCOPES = {"association": Association, "forum_theme": Theme, "global": None}

    name = models.CharField(max_length=50)

    scope = models.CharField(
        max_length=50,
        choices=[(scope_name, scope_name) for scope_name in SCOPES.keys()],
    )  # The application it targets
    scoped_to = models.CharField(
        max_length=50, blank=True, null=True
    )  # The id of the mother instance in the application

    def __str__(self):
        return "Namespace name={} scope={} scoped_to={}".format(
            self.name, self.scope, self.scoped_to
        )

    def get_scope_instance(self):
        if Namespace.SCOPES[self.scope] is None:
            return None

        try:
            scope = Namespace.SCOPES[self.scope].objects.get(pk=self.scoped_to)
            return scope
        except ObjectDoesNotExist:
            raise BrokenTagLink()


class Tag(models.Model):
    LINKS = {
        # Association
        "association": Association,
        "event": Event,
        "file": File,
        "folder": Folder,
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
    is_hidden = models.BooleanField(default=False)

    class Meta:
        unique_together = (("value", "namespace"),)

    @staticmethod
    def get_linked_instance(scope, scoped_to):
        try:
            instance = Tag.LINKS[scope].objects.get(pk=scoped_to)
            return instance
        except ObjectDoesNotExist:
            raise BrokenTagLink()


# Dynamically adds the needed fields to the tag
# It wouldn't work to simply do
# Tag.link_name = models.ManyToManyField(link_class, related_name="tags")
# with django orm
# more info : https://www.b-list.org/weblog/2019/mar/04/class/
for (link_name, link_class) in Tag.LINKS.items():
    field = models.ManyToManyField(link_class, related_name="tags")
    field.contribute_to_class(Tag, link_name)
