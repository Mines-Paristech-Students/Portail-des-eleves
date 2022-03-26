from django.contrib import admin

from .models import Game, Score


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "mode", "description", "pub_date")


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ("game", "user", "score", "when")
