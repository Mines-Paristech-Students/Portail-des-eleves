from datetime import datetime

from django.db.models import Q
from django_filters.rest_framework import (
    DateTimeFromToRangeFilter,
    FilterSet,
    CharFilter,
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
    current = CharFilter(method="filter_current")

    class Meta:
        model = Event
        fields = ("starts_at", "ends_at", "current", "association")

    def filter_current(self, queryset, _, value):
        condition = Q(starts_at__lte=datetime.now()) & Q(ends_at__gte=datetime.now())

        if value.lower() == "true" or len(value) == 0:
            return queryset.filter(condition)
        else:
            return queryset.exclude(condition)


class EventViewSet(viewsets.ModelViewSet):
    """
        Filters:
            - starts_at_before / starts_at_end: use a datetime like `2016-01-01 8:00` or a date like `2016-01-01`.
            - ends_at_before / ends_at_end: use a datetime like `2016-01-01 8:00` or a date like `2016-01-01`.
            - current: if set to `true`, only keep the currently ongoing events.
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
