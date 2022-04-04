from rest_framework import serializers
from authentication.models.user import User
from games.serializers.game import ShortGameSerializer
from games.models.game import Game
from games.models import Score


class CreateScoreSerializer(serializers.ModelSerializer):
    game = serializers.PrimaryKeyRelatedField(
        queryset=Game.objects.all(), many=False, read_only=False
    )
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=False, read_only=False
    )

    class Meta:
        model = Score
        read_only_fields = ("created_on",)
        fields = ("game", "user", "score") + read_only_fields


class ScoreSerializer(serializers.ModelSerializer):
    game = ShortGameSerializer()
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=False, read_only=False
    )

    class Meta:
        model = Score
        read_only_fields = ("created_on",)
        fields = ("game", "user", "score") + read_only_fields


class LeaderboardSerializer(serializers.Serializer):
    user = serializers.CharField()
    total_score = serializers.IntegerField(validators=[MinValueValidator(0)])

    class Meta:
        fields = ("user", "total_score")
