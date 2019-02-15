from django.contrib import admin

from forum.models import Theme, Topic

@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    fields = ('name', 'description', 'is_hidden_1A')

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    fields = ('name', 'creator', 'is_hidden_1A', 'theme')
