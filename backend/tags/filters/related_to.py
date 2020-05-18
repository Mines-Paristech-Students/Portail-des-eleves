import django_filters
from django.db.models import Count, Q
from django_filters import rest_framework as filters

from tags.models import Tag

"""
Related to filter must be used in DRF views to check that a tag has been assigned to at least one object of a certain
type. For instance if "my_tag" is related to a Media but to no Product, /tags/tags?related_to=tag must return my_tag
but /tags/tags?related_to=product must not.
It's possible to check multiple classes using commas. Example : /tags/tags?related_to=tag,product
"""


class RelatedToFilter(filters.FilterSet):
    related_to = django_filters.CharFilter(method="related_to__gte")

    def related_to__gte(self, queryset, value, *args, **kwargs):
        try:
            if args:
                models = args[0].split(",")

                or_filter = None
                for model in models:
                    if model not in Tag.LINKED_TO_MODEL.keys():
                        continue

                    annotation_name = f"num_{model}"
                    queryset = queryset.annotate(**{annotation_name: Count(model)})

                    new_condition = Q(**{f"{annotation_name}__gte": 1})
                    or_filter = (
                        new_condition
                        if or_filter is None
                        else or_filter | new_condition
                    )

                if or_filter is not None:
                    queryset = queryset.filter(or_filter)

        except ValueError:
            pass
        return queryset
