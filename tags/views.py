from django.core.exceptions import ObjectDoesNotExist
from django.http import (
    HttpResponseBadRequest,
    HttpResponse,
    HttpResponseForbidden,
    JsonResponse,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet

from tags.models import Namespace, Tag
from tags.permissions import (
    NamespacePermission,
    can_manage_links_for,
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


class TagViewSet(mixins.CreateModelMixin, mixins.DestroyModelMixin, GenericViewSet):
    serializer_class = TagSerializer
    permission_classes = (ManageTagPermission,)
    queryset = Tag.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        already_created = None
        try:
            already_created = Tag.objects.get(
                namespace=serializer.validated_data["namespace"],
                value=serializer.validated_data["value"],
            )
        except ObjectDoesNotExist:
            pass

        if already_created:
            return Response(
                self.serializer_class().to_representation(already_created),
                status=status.HTTP_201_CREATED,
            )
        else:
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class TagLinkView(APIView):
    def get_tag(self, request):
        if "tag" not in request.data:
            return HttpResponseBadRequest("No tag id provided")

        model, instance_pk = self.kwargs["model"], self.kwargs["instance_pk"]
        tag = Tag.objects.get(pk=request.data["tag"])

        if not can_manage_links_for(request.user, Tag.LINKS[model].get(pk=instance_pk)):
            return HttpResponseForbidden(
                "Cannot edit link for {} with id {}".format(model, tag)
            )

        return tag

    def post(self, request):
        tag = self.get_tag(request)
        model, instance_pk = self.kwargs["model"], self.kwargs["instance_pk"]
        getattr(tag, model).add(instance_pk)
        tag.save()
        return HttpResponse(code=201)

    def delete(self, request):
        tag = self.get_tag(request)
        model, instance_pk = self.kwargs["model"], self.kwargs["instance_pk"]
        getattr(tag, model).delete(instance_pk)
        tag.save()
        return HttpResponse(code=204)


def get_tags_for_scope(request, model, instance_pk):
    tags = Tag.objects.filter(namespace__scope=model, namespace__scoped_to=instance_pk).all()
    return JsonResponse({"tags": TagSerializer(many=True).to_representation(tags)})
