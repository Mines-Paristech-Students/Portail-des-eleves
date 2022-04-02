import django_filters

from rest_framework.permissions import IsAuthenticated
from rest_framework import pagination
from rest_framework import mixins, viewsets

from games.models import Game
from games.serializers import GameSerializer


class GamePagination(pagination.PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 10


class GameFilter(django_filters.FilterSet):
    class Meta:
        model = Game
        fields = ["mode"]


class GameViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet,
):
    queryset = Game.objects.all()
    filterset_class = GameFilter
    serializer_class = GameSerializer
    pagination_class = GamePagination
    permission_classes = [IsAuthenticated]
    ordering = ["-pub_date"]
