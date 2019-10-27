from django.contrib import admin

from associations.models import Association, Role


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "association",
        "role",
        "rank",
        "page",
        "marketplace",
        "library",
        "election",
        "event",
    )
    fieldsets = (
        (None, {"fields": ("user", "association", "role", "rank")}),
        (
            "Permissions",
            {
                "fields": (
                    "static_page",
                    "marketplace",
                    "library",
                    "vote",
                    "event",
                    "media",
                )
            },
        ),
    )


@admin.register(Association)
class AssociationAdmin(admin.ModelAdmin):
    list_display = ("name", "logo", "marketplace", "library", "is_hidden", "rank")
