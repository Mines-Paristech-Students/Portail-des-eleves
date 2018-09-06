from django.http import JsonResponse
from django.urls import path

from associations.views import buy

urlpatterns = [
    path("marketplace/buy/", buy),
    path('nique/', lambda x:  JsonResponse({"coucou": "adrien"}))
]
