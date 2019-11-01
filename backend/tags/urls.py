from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from tags.views import NamespaceViewSet, TagViewSet, TagLinkView, get_tags_for_scope

urlpatterns = [
    path(
        "link/<model>/<instance_pk>/tag/<int:tag_pk>/",
        TagLinkView.as_view(),
        name="tag_link_view",
    ),
    path("scope/<model>/<instance_pk>/", get_tags_for_scope, name="tag_scope_view"),
]
router = BulkRouter()

router.register(r"namespaces", NamespaceViewSet)
router.register(r"tags", TagViewSet)

urlpatterns += router.urls
