from datetime import date

from django.db.models import Q
from rest_framework import exceptions, generics, response, status, viewsets
from rest_framework.decorators import action

from polls.serializers import ReadOnlyPollSerializer, AuthorPollSerializer, AdminPollSerializer, VoteSerializer
from polls.models import Poll, Choice, Vote
from polls.permissions import PollPermission, ResultsPermission, VotePermission


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = ReadOnlyPollSerializer
    permission_classes = (PollPermission,)

    def get_queryset(self):
        if self.request.user.is_staff:
            # Give access to all the polls.
            return Poll.objects.all()
        else:
            # Give access to all the published polls and to their polls.
            return Poll.objects.filter(Q(user=self.request.user) |
                                       (Q(state='ACCEPTED') & Q(publication_date__lte=date.today())))

    def get_serializer_class(self):
        if self.action in ('create',):
            return AuthorPollSerializer

        if self.action in ('list',):
            return ReadOnlyPollSerializer

        if self.request.user.is_staff:
            return AdminPollSerializer
        elif self.action in ('update', 'partial_update'):
            return AuthorPollSerializer
        else:
            return ReadOnlyPollSerializer

    @action(detail=True, methods=('get',), permission_classes=(ResultsPermission,))
    def results(self, *args, **kwargs):
        poll = self.get_object()
        data = {'poll': poll.id, 'results': poll.results}
        return response.Response(data=data, status=status.HTTP_200_OK)


class CreateVoteView(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = (VotePermission,)

    def get_poll_or_404(self, **kwargs):
        request_poll = Poll.objects.filter(pk=kwargs.get('poll_pk'))

        if not request_poll.exists():
            raise exceptions.NotFound('Poll not found.')

        return request_poll[0]

    def create(self, request, *args, **kwargs):
        poll = self.get_poll_or_404(**kwargs)

        # Serialize the data.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if the given choice is valid.
        if serializer.validated_data['choice'] not in poll.choices:
            raise exceptions.ValidationError('Invalid choice provided.')

        # Check if the poll is active.
        if not poll.is_active:
            raise exceptions.PermissionDenied('This poll is not active.')

        # Check if the user has already voted.
        if request.user.id in [voter[0] for voter in poll.votes.values_list('user__id')]:
            raise exceptions.PermissionDenied('You have already voted.')

        # Save the object.
        serializer.save(poll=poll)
        headers = self.get_success_headers(serializer.data)

        return response.Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
