from datetime import date

from django.db.models import Q
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response

from polls.models import Poll, Vote
from polls.views import PollViewSet


@api_view(["GET"])
def widget_poll_view(request):
    todays_poll = Poll.objects.filter(
        Q(state="ACCEPTED") & Q(publication_date__lte=date.today())
    )

    if Vote.objects.filter(poll=todays_poll, user=request.user).exists():
        return Response(PollViewSet.as_view({"get": "results"})(request).content)
    else:
        return Response(PollViewSet.as_view({"get": "retrieve"})(request).content)
