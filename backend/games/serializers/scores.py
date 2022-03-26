from rest_framework import serializers
from authentication.models.user import User
from games.models.game import Game
from games.models import Score, Leaderboard


class ScoreSerializer(serializers.ModelSerializer):
    game = serializers.PrimaryKeyRelatedField(
        queryset=Game.objects.all(), many=False, read_only=False
    )
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=False, read_only=False
    )

    class Meta:
        model = Score
        read_only_fields = ("when",)
        fields = ("game", "user", "score") + read_only_fields
