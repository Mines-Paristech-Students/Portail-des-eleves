import django_filters

from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework import pagination, mixins, viewsets
from authentication.models.user import User
from games.serializers import (
    ScoreSerializer,
    CreateScoreSerializer,
)
from games.models import Game, Score

class ActionBasedPermission(AllowAny):
    """
    Grant or deny access to a view, based on a mapping in view.action_permissions
    """

    def has_permission(self, request, view):
        for klass, actions in getattr(view, "action_permissions", {}).items():
            if view.action in actions:
                return klass().has_permission(request, view)
        return False

class ScorePagination(pagination.PageNumberPagination):
    page_size = 5


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


class ScoreViewSet(
    mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet
):
    queryset = Score.objects.all()
    filterset_class = ScoreFilter
    pagination_class = ScorePagination
    ordering = ["-when"]

    serializers = {
        "list": ScoreSerializer,
        "create": CreateScoreSerializer,
    }

    def get_serializer_class(self):
        return self.serializers.get(self.action)

    action_permissions = {IsAuthenticated: ["list"], IsAdminUser: ["create"]}
    permission_classes = (ActionBasedPermission,)