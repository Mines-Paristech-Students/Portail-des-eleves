from django.db import models


class TagFilterableManager(models.Manager):
    def __init__(self):
        super().__init__()
        self.filter_criterion = None

    def get_queryset(self):
        if self.filter_criterion:
            return super().get_queryset().filter(self.filter_criterion)
        else:
            return super().get_queryset()
