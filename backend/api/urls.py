from django.conf.urls import include
from django.urls import path

import associations.urls
import authentication.urls
import chat.urls
import polls.urls
import repartitions.urls
import subscriptions.urls
import tags.urls

urlpatterns = [
    path("associations/", include(associations.urls)),
    path("", include(authentication.urls)),
    path("chat/", include(chat.urls)),
    path("polls/", include(polls.urls)),
    path("repartitions/", include(repartitions.urls)),
    path("subscriptions/", include(subscriptions.urls)),
    path("tags/", include(tags.urls)),
]
