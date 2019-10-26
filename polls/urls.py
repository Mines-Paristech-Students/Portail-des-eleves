from django.urls import path

from polls.views import (
    ListSubmittedPolls,
    ListAllPolls,
    RetrievePoll,
    RetrievePollForDate,
    SubmitPoll,
    UpdatePoll,
    PollResults,
    CreateVote,
)


urlpatterns = [
    path("submitted/", ListSubmittedPolls.as_view(), name="polls-submitted"),
    path("all/", ListAllPolls.as_view(), name="polls-all"),
    path("<int:id>/", RetrievePoll.as_view(), name="polls-retrieve"),
    path(
        "<int:year>/<int:month>/<int:day>/",
        RetrievePollForDate.as_view(),
        name="poll-retrieve-for-date",
    ),
    path("submit/", SubmitPoll.as_view(), name="polls-submit"),
    path("<int:id>/update/", UpdatePoll.as_view(), name="polls-update"),
    path("votes/<int:poll_id>/", PollResults.as_view(), name="polls-results"),
    path("votes/", CreateVote.as_view(), name="vote-for-poll"),
]
