from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import mixins

from subscriptions.models import WidgetSubscription
from subscriptions.permissions import WidgetSubscriptionPermission
from subscriptions.serializers import WidgetSubscriptionSerializer


class WidgetSubscriptionViewSet(
    viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.UpdateModelMixin
):
    """Simple getter/setter subscription preferences for every user. The preferences are stored in database as
    plain text so it could be anything. In practise, it'll be JSON formatted."""

    queryset = WidgetSubscription.objects.all()
    serializer_class = WidgetSubscriptionSerializer
    permission_classes = (WidgetSubscriptionPermission,)

    def get_queryset(self):
        return WidgetSubscription.objects.filter(user=self.request.user)

    @action(detail=False, methods=["GET"])
    def get(self, request):
        """Directly get the current user's subscription preferences from the right row in the BDD"""
        try:
            instance = self.get_queryset().get()
            return Response(self.serializer_class().to_representation(instance))
        except WidgetSubscription.DoesNotExist:
            return Response({})

    @action(detail=False, methods=["POST"])
    def set(self, request):
        """Directly set the current user's subscription preferences in the right row in the BDD"""
        try:
            instance = self.get_queryset().get()

            serializer = self.get_serializer(
                instance,
                data={"payload": request.data.get("payload", "")},
                partial=True,
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(serializer.data)
        except WidgetSubscription.DoesNotExist:
            request.data["user"] = self.request.user.id
            return self.create(request)
