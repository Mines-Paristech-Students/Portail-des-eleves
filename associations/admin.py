from django.contrib import admin

from associations.models import Association, Role

@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("user", "association", "role", "rank", "static_page", "news", "marketplace", "library", "vote", "events")
    fieldsets = (
        (None, {
            'fields': ('user', 'association', 'role', 'rank')
        }),
        ('Permissions', {
            'fields': ('static_page', 'news', 'marketplace', 'library', 'vote', 'events', 'files')
        })
    )

@admin.register(Association)
class AssociationAdmin(admin.ModelAdmin):
    list_display = ("name", "logo", "marketplace", "library", "publication", "is_hidden_1A", "rank")
