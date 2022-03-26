from django.db import models

GAME_MODES = (("S", ("SOLO")), ("M", ("MULTI")))


class Game(models.Model):
    id = models.CharField(unique=True, primary_key=True, max_length=30)

    name = models.CharField(max_length=128)
    mode = models.CharField(max_length=1, choices=GAME_MODES, default="S")
    description = models.CharField(max_length=512, blank=True, default="")

    pub_date = models.DateField(auto_now_add=True, blank=True)

    def __str__(self):
        return self.id