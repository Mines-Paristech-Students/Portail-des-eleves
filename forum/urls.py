from django.urls import path

from rest_framework_bulk.routes import BulkRouter

from forum.views import (
    ThemeViewSet,
    TopicViewSet,
    MessageForumViewSet,
    NewVoteMessageView,
)


router = BulkRouter()

router.register(r"", ThemeViewSet)
router.register(r"theme", TopicViewSet)
router.register(r"topic", MessageForumViewSet)

urlpatterns = [
    path("message-vote/", NewVoteMessageView.as_view(), name="new-vote-message")
] + router.urls
