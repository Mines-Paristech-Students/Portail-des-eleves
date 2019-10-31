from rest_framework import viewsets

from subscriptions.models import WidgetSubscription
from subscriptions.permissions import WidgetSubscriptionPermission
from subscriptions.serializers import WidgetSubscriptionSerializer


class WidgetSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = WidgetSubscription.objects.all()
    serializer_class = WidgetSubscriptionSerializer
    permission_classes = (WidgetSubscriptionPermission,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
