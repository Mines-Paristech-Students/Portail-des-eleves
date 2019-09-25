from django.urls import path

from polls.views import PollViewSet, CreateVoteView

from rest_framework_bulk.routes import BulkRouter

router = BulkRouter()
router.register(r'', PollViewSet)
urlpatterns = [path('<int:poll_pk>/vote/', CreateVoteView.as_view(), name='vote')] + router.urls
