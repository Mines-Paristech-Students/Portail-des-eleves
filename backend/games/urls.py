from rest_framework_bulk.routes import BulkRouter

from .views import GameViewSet, ScoreViewSet, LeaderboardViewSet

router = BulkRouter()
router.register(r"game", GameViewSet)
router.register(r"scores", ScoreViewSet)
router.register(r"scores/leaderboard", LeaderboardViewSet)

urlpatterns = []
urlpatterns += router.urls
