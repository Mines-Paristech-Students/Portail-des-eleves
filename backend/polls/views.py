from datetime import date, timedelta, datetime
from math import exp
from operator import itemgetter


from django.db.models import Q
from django.core.cache import cache
from django_filters.rest_framework import FilterSet, CharFilter, MultipleChoiceFilter
from rest_framework import exceptions, generics, permissions, response, status, viewsets
from rest_framework.decorators import action

from api.paginator import SmallResultsSetPagination
from polls.serializers import (
    ReadOnlyPollSerializer,
    AuthorPollSerializer,
    AdminPollSerializer,
    VoteSerializer,
)
from authentication.models import User
from polls.models import Poll, Vote
from polls.permissions import (
    PollPermission,
    ResultsPermission,
    VotePermission,
    PollStatsPermission,
)


def generate_stats():
    # Computing the rankings...
    all_users = User.objects.all()
    all_polls = Poll.objects.all()
    poll_leaderboard = {}

    for user in all_users:
        poll_leaderboard[user.id] = [0, 0, 0]

    for poll in all_polls:
        if not poll.has_been_published:
            continue

        poll_date = poll.publication_date
        coeff_poll = exp(-(date.today() - poll_date).days / 14)
        voters = poll.votes.values_list("user__id", "choice")

        for voter in voters:
            (user_id, user_choice) = voter
            flag_victory = (user_choice == poll.results) + 1  # 2 if won, 1 otherwise

            poll_leaderboard[user_id][flag_victory] = (
                coeff_poll + poll_leaderboard.get(user_id, 0)[flag_victory]
            )
            poll_leaderboard[user_id][0] = 1 + poll_leaderboard.get(user_id, 0)[0] #participations

    return poll_leaderboard


class PollFilter(FilterSet):
    """
    This class is needed because Django does not allow to filter on properties.

    Inspired by https://stackoverflow.com/a/44990300.
    """

    is_published = CharFilter(method="filter_is_published")
    is_active = CharFilter(method="filter_is_active")
    user = CharFilter(field_name="user__id")
    state = MultipleChoiceFilter(choices=Poll.STATES)

    class Meta:
        model = Poll
        fields = ("is_published", "is_active", "state", "user")

    def filter_is_published(self, queryset, name, value):
        condition = Q(publication_date__lte=date.today()) & Q(state="ACCEPTED")

        if value.lower() == "true" or len(value) == 0:
            return queryset.filter(condition)
        else:
            return queryset.exclude(condition)

    def filter_is_active(self, queryset, _, value):
        condition = (
            Q(publication_date__lte=date.today())
            & Q(state="ACCEPTED")
            & Q(publication_date__gt=date.today() - Poll.POLL_LIFETIME)
        )

        if value.lower() == "true" or len(value) == 0:
            return queryset.filter(condition)
        else:
            return queryset.exclude(condition)


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = ReadOnlyPollSerializer
    permission_classes = (PollPermission,)
    pagination_class = SmallResultsSetPagination
    filterset_class = PollFilter
    ordering_fields = ["question", "user__pk", "state", "publication_date"]

    def get_queryset(self):
        if self.request.user.is_staff:
            # Give access to all the polls.
            return Poll.objects.all().order_by(
                "-publication_date", "-creation_date_time"
            )
        else:
            # Give access to all the published polls and to their polls.
            return Poll.objects.filter(
                Q(user=self.request.user)
                | (Q(state="ACCEPTED") & Q(publication_date__lte=date.today()))
            ).order_by("-publication_date", "-creation_date_time")

    def get_serializer_class(self):
        if self.action in ("create",):
            return AuthorPollSerializer
        elif self.request.user.is_staff:
            return AdminPollSerializer
        elif self.action in ("list",):
            return ReadOnlyPollSerializer
        elif self.request.user == self.get_object().user:
            return AuthorPollSerializer
        else:
            return ReadOnlyPollSerializer

    @action(detail=True, methods=("get",), permission_classes=(ResultsPermission,))
    def results(self, *args, **kwargs):
        poll = self.get_object()
        data = {"poll": poll.id, "results": poll.results}
        return response.Response(data=data, status=status.HTTP_200_OK)

    @action(detail=False, methods=("get",))
    def stats(self, *args, **kwargs):
        is_active_condition = (
            Q(publication_date__lte=date.today())
            & Q(state="ACCEPTED")
            & Q(publication_date__gt=date.today() - Poll.POLL_LIFETIME)
        )

        """Return:
         - the number of polls with the REVIEWING (if the user is admin, otherwise None).
         - the number of polls to which the user can vote."""
        return response.Response(
            data={
                "number_of_pending_polls": Poll.objects.filter(
                    state="REVIEWING"
                ).count()
                if self.request.user.is_staff
                else None,
                "number_of_available_polls": Poll.objects.exclude(
                    votes__user=self.request.user
                )
                .filter(is_active_condition)
                .count(),
            }
        )

    @action(detail=False, methods=("get",))
    def statistics(self, *args, **kwargs):

        poll_leaderboard = {}
        top_n = 10

        if (
            cache.get("poll_leaderboard") is not None
            and self.request.user.id in cache.get("poll_leaderboard").keys()
        ):
            # Normally there should all be None or all be defined but just in case...
            poll_leaderboard = cache.get("poll_leaderboard")

        else:
            poll_leaderboard = generate_stats()

            # Setting up cache duration (until next poll's end)
            # That's not done in the "if" in case a new user is created between 2 cache updates
            cur_time = datetime.now()
            tomorrow = datetime(
                cur_time.year, cur_time.month, cur_time.day
            ) + timedelta(days=1)
            time_to_next_poll = (tomorrow - datetime.now()).seconds

            # Setting up cache to avoid recomputing the dicts
            cache.set("poll_leaderboard", poll_leaderboard, time_to_next_poll)

        sorted_users_participations = sorted(
            poll_leaderboard.items(), key=lambda x: x[1][0]
        )[::-1][:top_n]
        sorted_users_defeats_floating = sorted(
            poll_leaderboard.items(), key=lambda x: x[1][1]
        )[::-1][:top_n]
        sorted_users_victories_floating = sorted(
            poll_leaderboard.items(), key=lambda x: x[1][2]
        )[::-1][:top_n]

        return response.Response(
            data={
                "user_score": poll_leaderboard.get(self.request.user.id),
                "sorted_participations": sorted_users_participations,
                "sorted_weighted_victories": sorted_users_victories_floating,
                "sorted_weighted_defeats": sorted_users_defeats_floating,
            }
        )


class CreateVoteView(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = (VotePermission,)

    def get_poll_or_404(self, **kwargs):
        request_poll = Poll.objects.filter(pk=kwargs.get("poll_pk"))

        if not request_poll.exists():
            raise exceptions.NotFound("Poll not found.")

        return request_poll[0]

    def create(self, request, *args, **kwargs):
        poll = self.get_poll_or_404(**kwargs)

        # Serialize the data.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if the given choice is valid.
        if serializer.validated_data["choice"] not in poll.choices.all():
            raise exceptions.ValidationError("Invalid choice provided.")

        # Check if the poll is active.
        if not poll.is_active:
            raise exceptions.PermissionDenied("This poll is not active.")

        # Check if the user has already voted.
        if request.user.id in [
            voter[0] for voter in poll.votes.values_list("user__id")
        ]:
            raise exceptions.PermissionDenied("You have already voted.")

        # Save the object.
        serializer.save(poll=poll)
        headers = self.get_success_headers(serializer.data)

        return response.Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
