from rest_framework_bulk.routes import BulkRouter
from .views import GameViewSet, ScoreViewSet

router = BulkRouter()
router.register(r"game", GameViewSet)
router.register(r"scores", ScoreViewSet)

urlpatterns = []
urlpatterns += router.urls
