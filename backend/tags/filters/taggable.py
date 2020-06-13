import django_filters
from django.db.models import Q
from django_filters import rest_framework as filters

from tags.models import Tag

"""
Taggable filter allows to filter taggable objects with an intersection/union of tags. If you're working with Media 
for instance, `/associations/medias/?tag__are=1,2` will query all medias with tag 1 AND 2 if tag 1 and 2 are in a 
different namespace and 1 OR 2 if they are in the same namespace.
Conversely, `/associations/medias/?tag__in=1,2` will return all medias that have a tag with id 1 OR 2.

To sum up, if tag_1 and tag_2 are in the same namespace, and tag_3 in another one : 
- tag__in=id_1,id_2 : id_1 OR id_2
- tag__are=id_1,id_2,id_3: (id_1 OR id_2) AND id_3
"""


class TaggableFilter(filters.FilterSet):
    tags__are = django_filters.CharFilter(method="tags_are")

    def tags_are(self, queryset, value, *args, **kwargs):
        try:
            if args:
                tag_ids = args[0].split(",")
                tags = Tag.objects.filter(id__in=tag_ids).values("id", "namespace")

                conditions = dict()
                # regroup the tags by namespace, in a "tag id in" condition
                for tag in tags:
                    conditions.setdefault(tag["namespace"], []).append(tag["id"])

                # regroup the conditions in a AND condition with multiple filtering
                for key in conditions.keys():
                    queryset = queryset.filter(Q(**{"tags__id__in": conditions[key]}))

        except ValueError:
            pass
        return queryset
