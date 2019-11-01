from rest_framework_bulk.routes import BulkRouter

from forum.views import ThemeViewSet, TopicViewSet, MessageForumViewSet


router = BulkRouter()

router.register("themes", ThemeViewSet)
router.register("topics", TopicViewSet)
router.register("messages", MessageForumViewSet)

urlpatterns = router.urls
