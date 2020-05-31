from datetime import datetime

from django.db.models import Q
from django_filters.rest_framework import (
    DateTimeFromToRangeFilter,
    FilterSet,
    MultipleChoiceFilter,
)
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from associations.models import Event
from associations.permissions import EventsPermission, JoinEventPermission
from associations.serializers import EventSerializer, ReadOnlyEventSerializer


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
        # No filter or every filter.
        if len(times) == 0 or len(times) == 3:
            return queryset

        # Looks like the canonical way to get an "always False" condition:
        # https://stackoverflow.com/questions/35893867/always-false-q-object
        condition = Q(pk__in=[])

        if "BEFORE" in times:
            condition |= Q(ends_at__lte=datetime.now())

        if "NOW" in times:
            condition |= Q(starts_at__lte=datetime.now()) & Q(
                ends_at__gte=datetime.now()
            )

        if "AFTER" in times:
            condition |= Q(starts_at__gte=datetime.now())

        return queryset.filter(condition)


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
