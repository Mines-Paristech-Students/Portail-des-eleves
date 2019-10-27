from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.utils.functional import cached_property

from associations.models import (
    Media,
    Product,
    Loanable,
    Event,
    Page,
    Choice,
    Role,
    Loan,
    Association,
)
from forum.models import Theme, Topic, MessageForum
from tags.exceptions import BrokenTagLink


class Namespace(models.Model):
    """
        Represents a namespace for a `Tag` object. A namespace defines a `scope`, which is a “big” object, for instance
        a specific `Association` or a specific forum `Theme`. A `Tag` under this `Namespace` will be restricted to this
        object and its taggable children (a `Page` or a `File`, for instance).

        Namespaces can also have a global scope, meaning a `Tag` under this namespace can be used everywhere.

        Examples:
            * A global `Namespace` called `user` allows the creation of `Tag` objects on every taggable object (a
            `Page`, a `Product`…
            * A `Namespace` called `beer` scoped to the `Association` `biero` will allow users to tag the `biero`
            `Products` with tags such as: `beer:IPA`, `beer:belgian`, `beer:soft`…
    """

    class Meta:
        unique_together = ("name", "scoped_to_model", "scoped_to_pk")

    SCOPED_TO_MODELS = {
        "association": Association,
        "forum_theme": Theme,
        "global": None,
    }

    name = models.CharField(max_length=50)

    scoped_to_model = models.CharField(
        max_length=50,
        choices=[(scope_name, scope_name) for scope_name in SCOPED_TO_MODELS.keys()],
    )  # The targeted Model.

    scoped_to_pk = models.CharField(
        max_length=50, blank=True, null=True
    )  # The primary key of the targeted object, regarding to the targeted Model.

    def __str__(self):
        return "Namespace name={} scoped_to_model={} scoped_to={}".format(
            self.name, self.scoped_to_model, self.scoped_to_pk
        )

    @cached_property
    def scoped_to(self):
        if Namespace.SCOPED_TO_MODELS[self.scoped_to_model] is None:
            return None

        try:
            scope = Namespace.SCOPED_TO_MODELS[self.scoped_to_model].objects.get(
                pk=self.scoped_to_pk
            )
            return scope
        except ObjectDoesNotExist:
            raise BrokenTagLink()


class Tag(models.Model):
    """
        Represents a tag which can be linked to a instance of a model listed in `LINKED_TO_MODEL`, provided the tag's
        namespace is compatible (see `Namespace`).
    """

    LINKED_TO_MODEL = {
        # Association
        "association": Association,
        "event": Event,
        "file": Media,
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
    def get_linked_instance(linked_to_model, linked_to_pk):
        try:
            instance = Tag.LINKED_TO_MODEL[linked_to_model].objects.get(pk=linked_to_pk)
            return instance
        except ObjectDoesNotExist:
            raise BrokenTagLink()


# Dynamically adds the needed fields to the tag.
# It wouldn't work to simply do `Tag.link_name = models.ManyToManyField(link_class, related_name="tags")`.
# More info : https://www.b-list.org/weblog/2019/mar/04/class/.
for (link_name, link_class) in Tag.LINKED_TO_MODEL.items():
    field = models.ManyToManyField(link_class, related_name="tags")
    field.contribute_to_class(Tag, link_name)
