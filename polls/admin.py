from django.contrib import admin

from .models import Poll, Choice


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2


@admin.register(Poll)
class PollAdmin(admin.ModelAdmin):
    list_display = ('question', 'state', 'creation_date_time', 'publication_date')

    inlines = [
        ChoiceInline
    ]

    fieldsets = [
        (
            'Question',
            {
                'fields': ['question']
            }
        ),
        (
            'Auteur',
            {
                'fields': ['user']
            }
        ),
        (
            'Validation',
            {
                'fields': ['state', 'publication_date', 'admin_comment']
            }
        ),
    ]


class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('text',)

    fields = ('text', 'poll')
