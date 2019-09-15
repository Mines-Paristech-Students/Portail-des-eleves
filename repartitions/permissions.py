from rest_framework.permissions import BasePermission, SAFE_METHODS

from authentication.models import User
from repartitions.models import Wish, Campaign, Proposition, UserCampaign


def user_in_campaign(user: User, campaign: Campaign) -> bool:
    for category in campaign.categories.all():
        if user in [uc.user for uc in category.users_campaign.all()]:
            return True

    return False


class CanManageCampaign(BasePermission):
    message = "Editing association is not allowed."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_admin

    def has_object_permission(self, request, view, obj):

        if request.method in ('HEAD', 'OPTIONS'):
            return True
        if isinstance(obj, Campaign) and user_in_campaign(request.user, obj):
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

class UserCampaignPermission(BasePermission):

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_admin

    def has_object_permission(self, request, view, obj: UserCampaign):
        return request.method in SAFE_METHODS or request.user.is_admin or request.user == obj.user
