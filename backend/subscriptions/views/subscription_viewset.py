import json

from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from subscriptions.models import WidgetSubscription
from subscriptions.permissions import WidgetSubscriptionPermission
from subscriptions.serializers import WidgetSubscriptionSerializer


class WidgetSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = WidgetSubscription.objects.all()
    serializer_class = WidgetSubscriptionSerializer
    permission_classes = (WidgetSubscriptionPermission,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return WidgetSubscription.objects.filter(user=self.request.user)

    @action(detail=False, methods=["GET"])
    def get(self, request):
        try:
            instance = self.get_queryset().get()
            return Response(self.serializer_class().to_representation(instance))
        except WidgetSubscription.DoesNotExist:
            return Response({})

    @action(detail=False, methods=["POST"])
    def set(self, request):
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
            return self.create(request)
