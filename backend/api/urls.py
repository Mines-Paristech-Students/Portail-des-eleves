from django.conf.urls import include
from django.urls import path

import associations.urls
import authentication.urls
import polls.urls
import repartitions.urls
import subscriptions.urls
import tags.urls
import courses.urls
import games.urls

urlpatterns = [
    path("associations/", include(associations.urls)),
    path("", include(authentication.urls)),
    path("polls/", include(polls.urls)),
    path("repartitions/", include(repartitions.urls)),
    path("subscriptions/", include(subscriptions.urls)),
    path("tags/", include(tags.urls)),
    path("courses/", include(courses.urls)),
    path("games/", include(games.urls)),
]
