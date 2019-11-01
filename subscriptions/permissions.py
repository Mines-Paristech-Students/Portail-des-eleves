from rest_framework import permissions


class WidgetSubscriptionPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, subscription):
        return request.user == subscription.user
