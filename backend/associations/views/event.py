from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from associations.models import Event
from associations.permissions import EventsPermission, JoinEventPermission
from associations.serializers import EventSerializer, ReadOnlyEventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (EventsPermission,)

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
