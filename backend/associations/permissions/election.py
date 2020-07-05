from datetime import datetime, timezone

from rest_framework import permissions

from associations.models import Voter, Choice
from associations.permissions.utils import check_permission_from_post_data


class VoterPermission(permissions.BasePermission):
    """
                        | Permissions |
        Election admin  | CRUD        |
        User            |             |
    """

    message = "You are not allowed to access this voter."

    def has_permission(self, request, view):
        return request.method != "POST" or check_permission_from_post_data(
            request, "election"
        )

    def has_object_permission(self, request, view, voter: Voter):
        role = request.user.get_role(voter.election.association)
        return role and role.election


class ChoicePermission(permissions.BasePermission):
    """
                        | Permissions |
        Election admin  | CRUD        |
        User            |             |
    """

    message = "You are not allowed to access this choice."

    def has_permission(self, request, view):
        return request.method != "POST" or check_permission_from_post_data(
            request, "election"
        )

    def has_object_permission(self, request, view, choice: Choice):
        role = request.user.get_role(choice.election.association)
        return role and role.election


class ElectionPermission(permissions.BasePermission):
    """
                        | Permissions |
        Election admin  | CRUD        |
        User            | R           |

        This permission MUST NOT handle the endpoints /vote/ and /results/.
    """

    message = "You are not allowed to edit this election."

    def has_permission(self, request, view):
        if request.method in ("POST",):
            return check_permission_from_post_data(request, "election")

        return True

    def has_object_permission(self, request, view, election):
        role = request.user.get_role(election.association)

        if role and role.election:  # Elections administrator.
            return True
        else:
            return request.method in permissions.SAFE_METHODS


class ResultsPermission(permissions.BasePermission):
    """
                       | Before ends_at | After ends_at |
        Election admin | R              | R             |
        Others         |                | R             |
    """

    message = "You are not allowed to view the results of this election."

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, election):
        role = request.user.get_role(election.association)

        if role and role.election:
            return True

        return datetime.now(tz=timezone.utc) > election.ends_at
