from django.contrib import admin
from subscriptions.models import WidgetSubscription


@admin.register(WidgetSubscription)
class ChoiceAdmin(admin.ModelAdmin):
    fields = ("user", "widget", "displayed")
