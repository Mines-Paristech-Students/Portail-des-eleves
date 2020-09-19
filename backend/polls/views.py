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

    @action(detail=False, methods=("get",), permission_classes=(PollStatsPermission,))
    def statistics(self, *args, **kwargs):

        victories_by_user = {}
        defeats_by_user = {}
        participations_by_user = {}

        set_cache = False

        if (
            cache.get("participations") is not None
            and cache.get("victories_ranking") is not None
            and cache.get("defeats_ranking") is not None
        ):
            # Normally there should all be None or all be defined but just in case...
            participations_by_user = cache.get("participations")
            victories_by_user = cache.get("victories_ranking")
            defeats_by_user = cache.get("defeats_ranking")

        else:
            # Computing the rankings...

            for poll in self.queryset:
                if poll.has_been_published:
                    pollDate = poll.publication_date
                    coeff_poll = exp(-(date.today() - pollDate).days / 14)
                    voters = poll.votes.values_list("user__id", "choice")

                    for voter in voters:
                        user_id = voter[0]
                        user_choice = voter[1]

                        if user_choice == poll.results:
                            if user_id in victories_by_user:
                                victories_by_user[user_id] += coeff_poll
                            else:
                                victories_by_user[user_id] = coeff_poll
                        else:
                            if user_id in defeats_by_user:
                                defeats_by_user[user_id] += coeff_poll
                            else:
                                defeats_by_user[user_id] = coeff_poll

                        if user_id in participations_by_user:
                            participations_by_user[user_id] += 1
                        else:
                            participations_by_user[user_id] = 1

            set_cache = True

        all_users = User.objects.all()
        for user in all_users:
            if (
                user.id not in participations_by_user.keys()
            ):  # has never participated in any poll before
                participations_by_user[user.id] = 0

            if user.id not in victories_by_user.keys():  # has never won before
                victories_by_user[user.id] = 0

            if user.id not in defeats_by_user.keys():  # has never lost before
                defeats_by_user[user.id] = 0

        if set_cache:
            # Setting up cache duration (until next poll's end)
            # That's not done in the "if" in case a new user is created between 2 cache updates
            cur_time = datetime.now()
            tomorrow = datetime(
                cur_time.year, cur_time.month, cur_time.day
            ) + timedelta(days=1)
            time_to_next_poll = (tomorrow - datetime.now()).seconds

            # Setting up cache to avoid recomputing the dicts
            cache.set("participations", participations_by_user, time_to_next_poll)
            cache.set("victories_ranking", victories_by_user, time_to_next_poll)
            cache.set("defeats_ranking", defeats_by_user, time_to_next_poll)

        sorted_users_participations = sorted(
            participations_by_user.items(), key=itemgetter(1)
        )[::-1]
        sorted_users_defeats_floating = sorted(
            defeats_by_user.items(), key=itemgetter(1)
        )[::-1]
        sorted_users_victories_floating = sorted(
            victories_by_user.items(), key=itemgetter(1)
        )[::-1]

        return response.Response(
            data={
                "participations_score": participations_by_user[self.request.user.id],
                "weighted_victories_score": victories_by_user[self.request.user.id],
                "weighted_defeats_score": defeats_by_user[self.request.user.id],
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
