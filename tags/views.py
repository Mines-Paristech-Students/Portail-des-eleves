from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django.http import HttpResponseBadRequest, HttpResponseNotFound, JsonResponse, Http404, HttpResponse
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.views import APIView

from tags.models import Namespace, Tag
from tags.permissions import NamespacePermission, _get_parent_object, _check_can_access_scope, _check_can_access_scoped
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
    filterset_fields = ('scope', 'scoped_to')
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


class TagView(APIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


    def _get_target_instance(self, model, model_pk):
        if model not in Tag.LINKS.keys():
            raise Http404({"status": "not found"})

        try:
            instance = Tag.LINKS[model].objects.get(pk=model_pk)
        except ObjectDoesNotExist:
            raise Http404({"status": "not found", "message": "no {} with id {}".format(model, model_pk)})

        return instance

    def get(self, request, model, model_pk):
        instance = self._get_target_instance(model, model_pk)
        return JsonResponse({"tags": TagSerializer(many=True).to_representation(instance.tags)})


    def post(self, request, model, model_pk):
        instance = self._get_target_instance(model, model_pk)

        tag_pk = request.data.get("tag")
        if tag_pk:
            try:
                tag = Tag.objects.get(pk=tag_pk)
            except ObjectDoesNotExist:
                return HttpResponseNotFound({"status": "not found", "message": "no tag with id {}".format(tag_pk)})

            instance.tags.add(tag)
            instance.save()

            return JsonResponse({"status": "ok"})

        else:
            serializer = TagSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            tag = None
            try:
                tag = Tag.objects.get(
                    namespace=serializer.validated_data["namespace"],
                    value=serializer.validated_data["value"]
                )
            except ObjectDoesNotExist:
                pass

            if not tag:
                if not _check_can_access_scoped(request.user, instance):
                    raise PermissionDenied("You cannot edit this tag scope")

                tag = Tag.objects.create(serializer.validated_data)

            instance.tags.add(tag)
            instance.save()

            return JsonResponse({"status": "ok"})


    def delete(self, request, model, model_pk):
        instance = self._get_target_instance(model, model_pk)

        if not _check_can_access_scoped(request.user, instance):
            raise PermissionDenied("You cannot edit this tag scope")

        tag_pk = request.data.get("tag")
        tag = Tag.objects.get(pk=tag_pk)

        getattr(tag, model).delete(instance)
        flag = False
        for model in Tag.LINKS.keys():
            if len(getattr(tag, model).count()) > 0:
                flag = True

        if not flag:
            tag.delete()

        return HttpResponse(code=204)
