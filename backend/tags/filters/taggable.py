import django_filters
from django.db.models import Q
from django_filters import rest_framework as filters

"""
Taggable filter allows to filter taggable objects with an intersection of tags. If you're working with Media 
for instance, `/associations/medias/?tag__are=1,2` will query all medias with tag 1 AND 2.
Conversely, `/associations/medias/?tag__in=1,2` will return all medias that have a tag with id 1 OR 2.

To sum up : 
- tag__in=id_1,id_2 : id_1 OR id_2
- tag__are=id_1,id_2: id_1 AND id_2
"""


class TaggableFilter(filters.FilterSet):
    tags__are = django_filters.CharFilter(method="tags_are")

    def tags_are(self, queryset, value, *args, **kwargs):
        try:
            if args:
                tag_ids = args[0].split(",")
                for tag_id in tag_ids:
                    new_condition = Q(**{"tags__id": tag_id})
                    queryset = queryset & queryset.filter(new_condition)

        except ValueError:
            pass
        return queryset
