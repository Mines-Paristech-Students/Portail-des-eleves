from django.urls import path
from rest_framework_bulk.routes import BulkRouter

from games.views.scores import ScoreViewSet

# from .views import GamePaginatedList, GameRetrieve
from .views import GameViewSet

router = BulkRouter()

# Associations.
router.register(r"scores", ScoreViewSet)
router.register(r"game", GameViewSet)

urlpatterns = []
urlpatterns += router.urls

# urlpatterns = [
#     path("", GamePaginatedList.as_view(), name="game-list"),
#     path("<game_pk>/", GameRetrieve.as_view(), name="game-retrieve"),
# ]
