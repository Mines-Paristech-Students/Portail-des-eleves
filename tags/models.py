from django.db import models

from associations.models import File, Product, Loanable, Event, Page, Choice, Role, Folder, Loan
from forum.models import Theme, Topic, MessageForum


class Tag(models.Model):
    LINKS = (
        # Association
        ("choice", Choice),
        ("event", Event),
        ("file", File),
        ("folder", Folder),
        ("loan", Loan),
        ("loanable", Loanable),
        ("page", Page),
        ("product", Product),
        ("role", Role),

        # Forum
        ("theme", Theme),
        ("topic", Topic),
        ("message_forum", MessageForum),
    )

    key = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    url = models.CharField(max_length=255)


# Dynamically adds the needed fiields to the tag
for (link_name, link_class) in Tag.LINKS:
    field = models.ManyToManyField(link_class, related_name="tag")
    field.contribute_to_class(Tag, link_name)
