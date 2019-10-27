from django.http import HttpResponseBadRequest
from rest_framework.decorators import api_view
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

    filterset_fields = ("scoped_to_model", "scoped_to_pk")
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

        scope_model = self.request.query_params.get("scoped_to_model", None)
        scope_id = self.request.query_params.get("scope_id", None)

        if scope_model is not None and scope_id is not None:
            queryset = queryset.filter(
                namespace__scoped_to_model=scope_model, namespace__scoped_to_pk=scope_id
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

        if tag.namespace.scoped_to_model != "global" and not user_can_link_tag_to(
            request.user, tag, Tag.get_linked_instance(model, instance_pk)
        ):
            raise PermissionDenied(
                "Cannot edit link for {} with id {}".format(model, tag)
            )

        return tag

    def apply_recursive(self, folder, function):
        for file in folder.files.all():
            function(file)

        for child in folder.children.all():
            function(child)
            self.apply_recursive(child, function)

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


@api_view(["GET"])
def get_tags_for_scope(request, model, instance_pk):
    tags = Tag.objects.filter(
        namespace__scoped_to_model=model, namespace__scoped_to_pk=instance_pk
    ).all()
    return Response({"tags": TagSerializer(many=True).to_representation(tags)})
