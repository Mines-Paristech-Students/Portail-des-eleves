from django.conf.urls import include
from django.urls import path

import associations.urls
import authentication.urls
import chat.urls
import forum.urls
import polls.urls
#import repartitions.urls
import rer.urls
import subscriptions.urls

urlpatterns = [
    path('associations/', include(associations.urls)),
    path('', include(authentication.urls)),
    path('chat/', include(chat.urls)),
    path('forum/', include(forum.urls)),
    path('polls/', include(polls.urls)),
#    path('repartitions/', include(repartitions.urls)),
    path('rer/', include(rer.urls)),
    path('subscriptions/', include(subscriptions.urls)),
]
