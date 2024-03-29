import django_filters
from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpResponseBadRequest
from django_filters import rest_framework as filters
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from tags.filters.related_to import RelatedToFilter
from tags.models import Namespace, Tag
from tags.permissions import (
    NamespacePermission,
    user_can_link_tag_to,
    ManageTagPermission,
    get_parent_object,
)
from tags.serializers import NamespaceSerializer, TagSerializer


class NamespaceFilter(filters.FilterSet):
    # theses props should be listed automatically but because of drf-filter magics
    # it's hard to do so.
    association = django_filters.CharFilter(method="filter_child_of_related")
    loanable = django_filters.CharFilter(method="filter_child_of_related")
    media = django_filters.CharFilter(method="filter_child_of_related")
    page = django_filters.CharFilter(method="filter_child_of_related")
    product = django_filters.CharFilter(method="filter_child_of_related")
    role = django_filters.CharFilter(method="filter_child_of_related")

    def filter_child_of_related(self, queryset, value, *args, **kwargs):
        model = Tag.LINKED_TO_MODEL.get(value, None)
        if model is None:
            return queryset

        try:
            instance = model.objects.get(pk=args[0])
            parent = get_parent_object(instance)
            queryset = queryset.filter(
                Q(scoped_to_model="global")
                | Q(
                    scoped_to_model=Namespace.SCOPED_TO_MODELS_REV[parent.__class__],
                    scoped_to_pk=parent.id,
                )
            )
        except model.DoesNotExist:
            pass

        return queryset

    class Meta:
        model = Namespace
        fields = ("scoped_to_model", "scoped_to_pk")


"""
To create a namespace : 
- either be an admin and create a global scope
- either specify a scope and a scoped_to and have permissions on the scoped_to object
"""


class NamespaceViewSet(viewsets.ModelViewSet):
    queryset = Namespace.objects.all()
    serializer_class = NamespaceSerializer
    filterset_class = NamespaceFilter
    permission_classes = (NamespacePermission,)

    def create(self, request, *args, **kwargs):
        # Required since we use "unique_together"
        if "scoped_to_pk" not in request.data:
            request.data["scoped_to_pk"] = ""

        return super(NamespaceViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if "scoped_to_model" in request.data or "scoped_to_pk" in request.data:
            return HttpResponseBadRequest("Cannot change scope of a namespace")

        return super(NamespaceViewSet, self).update(request, *args, **kwargs)


class TagFilter(RelatedToFilter):
    class Meta:
        model = Tag
        fields = {
            **{key: ["exact"] for key in tuple(Tag.LINKED_TO_MODEL.keys())},
            **{
                "namespace__scoped_to_model": ["exact"],
                "namespace__scoped_to_pk": ["exact"],
                "namespace": ["exact"],
                "media__mimetype": ["exact", "contains"],
            },
        }


class TagViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    serializer_class = TagSerializer
    permission_classes = (ManageTagPermission,)
    queryset = Tag.objects.all()

    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = TagFilter

    def create(self, request, *args, **kwargs):
        if "namespace" in request.data and "value" in request.data:
            try:
                tag = Tag.objects.get(
                    namespace=request.data.get("namespace"),
                    value=request.data.get("value"),
                )
                return Response(TagSerializer().to_representation(tag), status=201)
            except Tag.DoesNotExist:
                pass

        return super(TagViewSet, self).create(request, *args, **kwargs)


class TagLinkView(APIView):
    def get_tag(self, request, tag_pk):
        model, instance_pk = self.kwargs["model"], self.kwargs["instance_pk"]
        tag = Tag.objects.get(pk=tag_pk)

        if tag.namespace.scoped_to_model != "global" and not user_can_link_tag_to(
            request.user, tag, Tag.get_linked_instance(model, instance_pk)
        ):
            raise PermissionDenied(
                "Cannot edit link for {} with id {}".format(model, tag)
            )

        return tag

    def post(self, request, model, instance_pk, tag_pk):
        tag = self.get_tag(request, tag_pk)
        try:
            getattr(tag, model).add(instance_pk)
            tag.save()
        except IntegrityError:
            return Response(status=200, data="Tag is already linked")

        return Response(status=201)

    def delete(self, request, model, instance_pk, tag_pk):
        tag = self.get_tag(request, tag_pk)
        getattr(tag, model).remove(instance_pk)
        tag.save()

        count_links = 0
        for model in Tag.LINKED_TO_MODEL:
            count_links += getattr(tag, model).count()
            break
        if count_links == 0:
            tag.delete()

        return Response(status=204)


@api_view(["GET"])
def get_namespaces_for_object(request, model, instance_pk):
    """Returns the namespaces that the object of type `model` and id `instance_pk` can get tags from"""

    instance = Tag.LINKED_TO_MODEL[model].objects.get(pk=instance_pk)
    parent = get_parent_object(instance)

    namespaces = Namespace.objects.filter(
        Q(scoped_to_model=parent.__class__.__name__.lower(), scoped_to_pk=parent.id)
        | Q(scoped_to_model="global")
    ).all()
    return Response(
        {"namespaces": NamespaceSerializer(many=True).to_representation(namespaces)}
    )
