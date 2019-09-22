from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from tags.views import NamespaceViewSet, TagView

urlpatterns = [
    path(
        'models/<model>/<model_pk>/',
        TagView.as_view(),
        name="tag_view"
    ),
]
router = BulkRouter()

router.register(r'namespaces', NamespaceViewSet)

urlpatterns += router.urls
