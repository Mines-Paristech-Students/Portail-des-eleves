from django.contrib import admin

# Register your models here.

from tutorings.models import Tutoring, TutorApplication


class ApplyTutorInline(admin.TabularInline):
    model = TutorApplication


@admin.register(Tutoring)
class TutoringAdmin(admin.ModelAdmin):
    list_display = ("name","contact",
                    "place",
                    "subject", "level",
                    "time_availability", "frequency", "description")

    inlines = [ApplyTutorInline]

    fields = list_display + ("state", "publication_date", "papseur","admin_comment")



