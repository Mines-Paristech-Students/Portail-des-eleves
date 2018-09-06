from django.shortcuts import get_object_or_404

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound

from polls.serializers import RestrictedPollSerializer, WholePollSerializer, SubmitPollSerializer, UpdatePollSerializer
from polls.models import Poll


class ListCurrentPolls(ListAPIView):
    """List the currently published polls."""
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Poll.objects.all()

    def get(self, request, *args, **kwargs):
        published_polls_ids = [poll.id for poll in Poll.objects.all() if poll.is_published()]
        polls = Poll.objects.filter(id__in=published_polls_ids)
        serialized_polls = RestrictedPollSerializer(polls, many=True, context={'request': request})

        return Response(serialized_polls.data)


class ListSubmittedPolls(ListAPIView):
    """List the polls submitted by the user."""

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Poll.objects.all()

    def get(self, request, *args, **kwargs):
        polls = Poll.objects.filter(user__id=request.user.id)
        serialized_polls = WholePollSerializer(polls, many=True, context={'request': request})

        return Response(serialized_polls.data)


class ListAllPolls(ListAPIView):
    """If the user is an admin, list all the polls."""
    permission_classes = (permissions.IsAdminUser,)
    queryset = Poll.objects.all()
    serializer_class = WholePollSerializer


class RetrievePoll(APIView):
    """
    If the user is an admin, they may retrieve the full version of any poll.
    Otherwise, they may only retrieve the full version of one of their poll, or a restricted published poll.
    """

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, id):
        poll = get_object_or_404(Poll, id=id)

        if request.user.is_admin or poll.user == request.user:
            serialized_poll = WholePollSerializer(poll, context={'request': request})
        else:  # the user is not an admin and the poll was not submitted by them.
            if not poll.is_published():
                # raise NotFound and not PermissionDenied so that it's impossible to know if a poll exists at this id.
                raise NotFound
            else:
                serialized_poll = RestrictedPollSerializer(poll, context={'request': request})

        return Response(serialized_poll.data)


class SubmitPoll(CreateAPIView):
    """Create a Poll."""

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = SubmitPollSerializer

    def create(self, request, *args, **kwargs):
        serializer = SubmitPollSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UpdatePoll(UpdateAPIView):
    """If the user is an admin, update a poll."""

    permission_classes = (permissions.IsAdminUser,)
    lookup_field = 'id'

    queryset = Poll.objects.all()
    serializer_class = UpdatePollSerializer
