from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from tags.views import (
    NamespaceViewSet,
    TagViewSet,
    TagLinkView,
    get_namespaces_for_object,
)

urlpatterns = [
    path(
        "link/<model>/<instance_pk>/tag/<int:tag_pk>/",
        TagLinkView.as_view(),
        name="tag_link_view",
    ),
    path(
        "namespaces/<model>/<instance_pk>/",
        get_namespaces_for_object,
        name="tag_scope_view",
    ),
]
router = BulkRouter()

router.register(r"namespaces", NamespaceViewSet)
router.register(r"tags", TagViewSet)

urlpatterns += router.urls
