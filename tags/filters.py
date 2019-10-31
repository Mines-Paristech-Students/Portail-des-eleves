from django.db.models import Q
from rest_framework import filters

from associations.models import (
    Association,
    Election,
    Event,
    Media,
    Funding,
    Library,
    Loanable,
    Loan,
    Marketplace,
    Page,
    Product,
    Transaction,
    Role,
)
from forum.models import Theme, Topic, MessageForum
from tags.models import Tag


class HasHiddenTagFilter(filters.BaseFilterBackend):
    """
        Filter the query sets by excluding any object which has a `hidden` tag or whose parent has a `hidden` tag.
        Please note that this filter has no effect on the nested objects which are fetched from a `Serializer`.
    """

    def filter_queryset(self, request, queryset, view):
        exclude_conditions = {
            # Associations.
            Association: Q(tags__is_hidden=True),
            Election: Q(association__tags__is_hidden=True),
            Event: Q(association__tags__is_hidden=True),
            Funding: Q(marketplace__association__tags__is_hidden=True),
            Library: Q(association__tags__is_hidden=True),
            Loanable: Q(tags__is_hidden=True)
            | Q(library__association__tags__is_hidden=True),
            Loan: Q(loanable__library__association__tags__is_hidden=True),
            Marketplace: Q(association__tags__is_hidden=True),
            Media: Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True),
            Page: Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True),
            Product: Q(tags__is_hidden=True)
            | Q(marketplace__association__tags__is_hidden=True),
            Transaction: Q(product__marketplace__association__tags__is_hidden=True),
            Role: Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True),
            # Forum.
            Theme: Q(tags__is_hidden=True),
            Topic: Q(theme__tags__is_hidden=True),
            MessageForum: Q(topic__theme__tags__is_hidden=True),
            # Tags.
            Tag: Q(is_hidden=True),
        }

        if request.user and request.user.is_authenticated and not request.user.show:
            if queryset.model and queryset.model in exclude_conditions:
                return queryset.exclude(exclude_conditions[queryset.model])

        return queryset
