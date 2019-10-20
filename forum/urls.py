from django.urls import path

from rest_framework_bulk.routes import BulkRouter

from forum.views import (
    ThemeViewSet,
    TopicViewSet,
    MessageForumViewSet,
    NewVoteMessageView,
)


router = BulkRouter()

router.register(r"themes", ThemeViewSet)
router.register(r"topics", TopicViewSet)
router.register(r"messages", MessageForumViewSet)

urlpatterns = [
    path("message-vote/", NewVoteMessageView.as_view(), name="new-vote-message")
] + router.urls
