from datetime import datetime

from django.db.models import Case, When, Value, CharField
from django_filters.rest_framework import (
    DateTimeFromToRangeFilter,
    FilterSet,
    MultipleChoiceFilter,
    DjangoFilterBackend,
)
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from associations.models import Event
from associations.permissions import EventsPermission, JoinEventPermission
from associations.serializers import EventSerializer, ReadOnlyEventSerializer
from tags.filters import HasHiddenTagFilter


class EventFilter(FilterSet):
    starts_at = DateTimeFromToRangeFilter()
    ends_at = DateTimeFromToRangeFilter()
    time = MultipleChoiceFilter(
        choices=(("BEFORE", "BEFORE"), ("NOW", "NOW"), ("AFTER", "AFTER")),
        method="filter_time",
    )

    class Meta:
        model = Event
        fields = ("starts_at", "ends_at", "association", "time")

    def filter_time(self, queryset, _, times):
        """Filter the events by time (BEFORE, NOW, AFTER) and return them in that order:
        * NOW, ordered by "-starts_at"
        * AFTER, ordered by "starts_at"
        * BEFORE, ordered by "-starts_at".

        Note that this ordering may be overriden with the starts_at parameter.
        """

        # Inspired by https://stackoverflow.com/a/38390480.

        now = (
            queryset.filter(
                starts_at__lte=datetime.now(), ends_at__gte=datetime.now()
            ).order_by("-starts_at")
            if "NOW" in times
            else Event.objects.none()
        )

        after = (
            queryset.filter(starts_at__gte=datetime.now()).order_by("starts_at")
            if "AFTER" in times
            else Event.objects.none()
        )

        before = (
            queryset.filter(ends_at__lte=datetime.now()).order_by("-starts_at")
            if "BEFORE" in times
            else Event.objects.none()
        )

        return (
            (now | after | before)
            .annotate(
                ordering=Case(
                    *(
                        [
                            When(pk=pk, then=Value(f"A{rank}"))
                            for rank, pk in enumerate(now.values_list("pk", flat=True))
                        ]
                        + [
                            When(pk=pk, then=Value(f"B{rank}"))
                            for rank, pk in enumerate(
                                after.values_list("pk", flat=True)
                            )
                        ]
                        + [
                            When(pk=pk, then=Value(f"C{rank}"))
                            for rank, pk in enumerate(
                                before.values_list("pk", flat=True)
                            )
                        ]
                    ),
                    output_field=CharField(),
                )
            )
            .order_by("ordering")
        )


class EventViewSet(viewsets.ModelViewSet):
    """
        Filters:
            - starts_at_before / starts_at_end: use a datetime like `2016-01-01 8:00` or a date like `2016-01-01`.
            - ends_at_before / ends_at_end: use a datetime like `2016-01-01 8:00` or a date like `2016-01-01`.
            - time: choose between BEFORE, NOW, AFTER. If several `time` are provided, the conditions are OR'ed.
            - association: filter the organizing association.
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (EventsPermission,)
    filterset_class = EventFilter
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
        HasHiddenTagFilter,
    )  # SearchFilter is not enabled by default.
    search_fields = ("name", "place", "description")
    ordering_fields = ["starts_at"]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return EventSerializer

        return ReadOnlyEventSerializer

    @action(detail=True, methods=("put",), permission_classes=(JoinEventPermission,))
    def join(self, request, *args, **kwargs):
        event = self.get_object()
        event.participants.add(request.user)
        return Response(data={"event": event.id, "user": request.user.id})

    @action(detail=True, methods=("put",), permission_classes=(JoinEventPermission,))
    def leave(self, request, *args, **kwargs):
        event = self.get_object()
        event.participants.remove(request.user)
        return Response(data={"event": event.id, "user": request.user.id})
