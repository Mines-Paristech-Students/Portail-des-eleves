import django_filters

from rest_framework.permissions import IsAuthenticated
from rest_framework import pagination
from rest_framework import mixins, viewsets
from authentication.models.user import User
from games.serializers.scores import ScoreSerializer
from games.models.game import Game

from games.models.scores import Score


class ScorePagination(pagination.PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 10


class ScoreFilter(django_filters.FilterSet):
    game = django_filters.ModelChoiceFilter(
        field_name="game__id", queryset=Game.objects.all()
    )
    user = django_filters.ModelChoiceFilter(
        field_name="user__id", queryset=User.objects.all()
    )

    class Meta:
        model = Score
        fields = ("game", "user")


class ScoreViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Score.objects.all()
    filterset_class = ScoreFilter
    serializer_class = ScoreSerializer
    pagination_class = ScorePagination
    permission_classes = [IsAuthenticated]
    ordering = ["-when"]
