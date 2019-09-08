from rest_framework.permissions import BasePermission, SAFE_METHODS
from repartitions.models import Wish, Campaign, Proposition


class CanManageCampaign(BasePermission):
    message = "Editing association is not allowed."

    def has_permission(self, request, view):

        if request.method in SAFE_METHODS:
            return True

        return request.user.is_admin

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        if request.user.is_admin:
            if isinstance(obj, Campaign):
                manager = obj.manager
            elif isinstance(obj, Proposition):
                manager = obj.campaign.manager
            elif isinstance(obj, Wish):
                manager = obj.proposition.campaign.manager
            else:
                return False

            return manager.id == request.user.id

        if isinstance(obj, Wish):
            return request.user == obj.user

        return False
