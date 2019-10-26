from django.urls import path

from rer.views import get_rer_timetable

urlpatterns = [path("", get_rer_timetable, name="get_rer_timetable")]
