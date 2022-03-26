from django.db import models
from django.core.validators import MinValueValidator

from authentication.models.user import User

from .game import Game


class Score(models.Model):
    game = models.ForeignKey(
        Game, verbose_name="game", on_delete=models.CASCADE, related_name="score"
    )

    user = models.ForeignKey(
        User, verbose_name="user", on_delete=models.CASCADE, related_name="score"
    )

    score = models.IntegerField(
        verbose_name="score", validators=[MinValueValidator(0)], default=0
    )

    when = models.DateTimeField(verbose_name="when", auto_now_add=True, blank=True)


class Leaderboard(models.Model):
    game = models.ForeignKey(
        Game, verbose_name="game", on_delete=models.CASCADE, related_name="leaderboard"
    )

    user = models.ForeignKey(
        User, verbose_name="user", on_delete=models.CASCADE, related_name="leaderboard"
    )

    highest_score = models.ForeignKey(
        Score,
        verbose_name="highest_score",
        on_delete=models.CASCADE,
        related_name="leaderboard",
    )
