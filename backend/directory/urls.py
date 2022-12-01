from rest_framework_bulk.routes import BulkRouter

from directory.views import DoctorViewSet

urlpatterns = []
router = BulkRouter()

router.register(r"doctors", DoctorViewSet)

urlpatterns += router.urls
