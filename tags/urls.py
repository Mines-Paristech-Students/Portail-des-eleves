from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from tags.views import NamespaceViewSet, TagViewSet, TagLinkView

urlpatterns = [
    path(
        'link/<model>/<instance_pk>/',
        TagLinkView.as_view(),
        name="tag_link_view"
    ),
]
router = BulkRouter()

router.register(r'namespaces', NamespaceViewSet)
router.register(r'tag', TagViewSet)

urlpatterns += router.urls
