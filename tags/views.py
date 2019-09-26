from django.http import HttpResponseBadRequest
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from tags.models import Namespace, Tag
from tags.permissions import (
    NamespacePermission,
    user_can_link_tag_to,
    ManageTagPermission,
)
from tags.serializers import NamespaceSerializer, TagSerializer

"""

To create a namespace : 
- either be an admin and create a global scope
- either specify a scope and a scoped_to and have permissions on the scoped_to object

"""


class NamespaceViewSet(viewsets.ModelViewSet):
    queryset = Namespace.objects.all()
    serializer_class = NamespaceSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ("scope", "scoped_to")
    permission_classes = (NamespacePermission,)

    def create(self, request, *args, **kwargs):
        # Required since we use "unique_together"
        if "scoped_to" not in request.data:
            request.data["scoped_to"] = ""

        return super(NamespaceViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if "scope" in request.data or "scoped_to" in request.data:
            return HttpResponseBadRequest("Cannot change scope of a namespace")

        return super(NamespaceViewSet, self).update(request, *args, **kwargs)


class TagViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    serializer_class = TagSerializer
    permission_classes = (ManageTagPermission,)
    queryset = Tag.objects.all()

    def get_queryset(self):
        queryset = self.queryset

        scope = self.request.query_params.get("scope", None)
        scope_id = self.request.query_params.get("scope_id", None)

        if scope is not None and scope_id is not None:
            queryset = queryset.filter(
                namespace__scope=scope, namespace__scoped_to=scope_id
            )

        return queryset

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

        if tag.namespace.scope != "global" and not user_can_link_tag_to(
            request.user, tag, Tag.get_linked_instance(model, instance_pk)
        ):
            raise PermissionDenied(
                "Cannot edit link for {} with id {}".format(model, tag)
            )

        return tag

    def post(self, request, model, instance_pk, tag_pk):
        tag = self.get_tag(request, tag_pk)
        getattr(tag, model).add(instance_pk)
        tag.save()
        return Response(status=201)

    def delete(self, request, model, instance_pk, tag_pk):
        tag = self.get_tag(request, tag_pk)
        getattr(tag, model).remove(instance_pk)
        tag.save()
        return Response(status=204)


def get_tags_for_scope(request, model, instance_pk):
    tags = Tag.objects.filter(
        namespace__scope=model, namespace__scoped_to=instance_pk
    ).all()
    return Response({"tags": TagSerializer(many=True).to_representation(tags)})
