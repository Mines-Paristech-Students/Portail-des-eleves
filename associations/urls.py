from django.http import HttpResponse
from django.urls import path
from rest_framework.exceptions import AuthenticationFailed

from associations.views import AssociationsListView

urlpatterns = [
    path('list/', AssociationsListView.as_view(), name='associations_long_list'),
    path('list/<int:number>', AssociationsListView.as_view(), name='associations_short_list'),
]