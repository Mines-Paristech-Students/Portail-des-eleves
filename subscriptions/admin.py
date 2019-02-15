from django.contrib import admin
from subscriptions.models import AssociationSubscription, Widget, WidgetSubscription

@admin.register(Widget)
class WidgetAdmin(admin.ModelAdmin):
    fields = ('name',)

@admin.register(WidgetSubscription)
class ChoiceAdmin(admin.ModelAdmin):
    fields = ('user', 'widget', 'displayed')


@admin.register(AssociationSubscription)
class VoteAdmin(admin.ModelAdmin):
    fields = ('user', 'association', 'subscribed')
