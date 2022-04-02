from rest_framework_bulk.routes import BulkRouter
from .views import GameViewSet

router = BulkRouter()
router.register(r"game", GameViewSet)

urlpatterns = []
urlpatterns += router.urls
