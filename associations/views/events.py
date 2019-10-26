from rest_framework.decorators import action
from rest_framework.response import Response

from associations.models import Association, Event
from associations.permissions import EventsPermission
from associations.serializers import EventSerializer
from associations.views import AssociationNestedViewSet


class EventViewSet(AssociationNestedViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (EventsPermission,)

    def get_queryset(self):
        return Event.objects.filter(association=self.kwargs["association_pk"])

    def perform_update(self, serializer):
        serializer.save(
            association=Association.objects.get(pk=self.kwargs["association_pk"])
        )

    def perform_create(self, serializer):
        serializer.save(
            association=Association.objects.get(pk=self.kwargs["association_pk"])
        )

    @action(detail=True, methods=("get",))
    def join(self, request, pk, association_pk):
        event = self.get_object()
        event.participants.add(request.user)
        return Response(data={"event": event.id, "user": request.user.id})

    @action(detail=True, methods=("get",))
    def leave(self, request, pk, association_pk):
        event = self.get_object()
        event.participants.remove(request.user)
        return Response(data={"event": event.id, "user": request.user.id})
