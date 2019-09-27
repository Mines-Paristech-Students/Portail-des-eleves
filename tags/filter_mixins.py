from django.db.models import QuerySet
from django.db.models import Q

from authentication.models import User
from tags.models import Tag


class TagFilterMixin:
    """
    This mixin will filter all objects to only show the ones with no hidden tags. To use it, add the mixin as **first**
     mixin for the APIViewSet of your choice.
     Example :
        class ThemeViewSet(viewsets.ModelViewSet) -> class ThemeViewSet(TagFilterMixin, viewsets.ModelViewSet)

    If the model of the viewset hasn't directly a tag, you can easily edit the filter condition with `tag_hidden_path`
    For instance, if you want to filter files whose folder is_hidden :
        `self.hiding_condition = {"folder__tags__is_hidden": True}`

    Tips :
        - https://stackoverflow.com/questions/769843/how-do-i-use-and-in-a-django-filter
        - https://stackoverflow.com/questions/739776/how-do-i-do-an-or-filter-in-a-django-query

    If you want to redifine the `get_queryset` method of the View, please make sure to call the super method first
    so the filtering is still enforced.
    Example:
        class MyView(TagFilterMixin, viewsets.ModelViewSet):
            def get_queryset(self):
                queryset = super(TagFilterMixin, self).get_queryset()
                [your code]
                return queryset
    """

    hiding_condition = {"tags__is_hidden": False}

    def get_queryset(self):
        assert self.queryset is not None, (
            "'%s' should either include a `queryset` attribute, "
            "or override the `get_queryset()` method." % self.__class__.__name__
        )

        queryset = self.queryset

        if isinstance(queryset, QuerySet):
            if (
                queryset.model in Tag.LINKS.values()
                and self.request.user.show()
            ):
                hiding_condition = (
                    Q(**self.hiding_condition)
                    if not isinstance(self.hiding_condition, Q)
                    else self.hiding_condition
                )

                queryset = queryset.filter(Q(tags__is_hidden=True) | hiding_condition)

            # Ensure queryset is re-evaluated on each request.
            queryset = queryset.all()

        return queryset
