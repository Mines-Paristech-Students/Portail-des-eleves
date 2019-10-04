from django.urls import path

from rest_framework_bulk.routes import BulkRouter

from forum.views import ThemeViewSet, TopicViewSet, MessageForumViewSet


router = BulkRouter()

router.register(r"themes", ThemeViewSet)
router.register(r"topics", TopicViewSet)
router.register(r"messages", MessageForumViewSet)

urlpatterns = router.urls
