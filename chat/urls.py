from django.urls import path

from chat.views import ChatMessageViewSet

urlpatterns = [
    path('', ChatMessageViewSet.as_view()),
]
