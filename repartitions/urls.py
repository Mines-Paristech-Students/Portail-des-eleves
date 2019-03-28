from django.conf.urls import url, include
from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from repartitions.views import RepartitionsViewSet

router = BulkRouter()

router.register(r'all', RepartitionsViewSet)

urlpatterns = router.urls