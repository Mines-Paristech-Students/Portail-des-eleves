from rest_framework_bulk.routes import BulkRouter

from chat.views import ChatMessageViewSet

router = BulkRouter()
router.register("", ChatMessageViewSet)

urlpatterns = router.urls
