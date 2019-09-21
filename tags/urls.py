from rest_framework_bulk.routes import BulkRouter

from tags.views import NamespaceViewSet

urlpatterns = []
router = BulkRouter()

router.register(r'namespaces', NamespaceViewSet)

urlpatterns += router.urls
