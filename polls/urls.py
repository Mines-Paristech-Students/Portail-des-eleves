from django.urls import path

from polls.views import ListCurrentPolls, ListSubmittedPolls, ListAllPolls, RetrievePoll, SubmitPoll, UpdatePoll


urlpatterns = [
    path('', ListCurrentPolls.as_view(), name='polls-current'),
    path('submitted/', ListSubmittedPolls.as_view(), name='polls-submitted'),
    path('all/', ListAllPolls.as_view(), name='polls-all'),
    path('<int:id>', RetrievePoll.as_view(), name='polls-retrieve'),
    path('submit/', SubmitPoll.as_view(), name='polls-submit'),
    path('<int:id>/update', UpdatePoll.as_view(), name='polls-update'),
]