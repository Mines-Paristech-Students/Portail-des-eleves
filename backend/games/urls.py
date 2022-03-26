from django.urls import path

from .views import GamePaginatedList

urlpatterns = [
    path("", GamePaginatedList.as_view(), name="game-list"),
]
