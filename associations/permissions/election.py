from datetime import datetime, timezone

from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions

from associations.models import Association, Election


class ElectionPermission(permissions.BasePermission):
    """
                       | Permissions |
        Election admin | CRUD        |
        Simple         | R           |

        This permission SHOULD NOT handle the endpoints /vote/ and /results/.
    """

    message = 'You are not allowed to edit this election.'

    def has_permission(self, request, view):
        try:
            association = Association.objects.get(pk=view.kwargs['association_pk'])
        except ObjectDoesNotExist:
            # The association does not exist, return True so the view can raise a 404.
            return True

        role = request.user.get_role(association)

        if role and role.election:
            # Election administrator.
            return True
        else:
            return request.method in permissions.SAFE_METHODS


class ResultsPermission(permissions.BasePermission):
    """
                       | Before ends_at | After ends_at |
        Election admin | R              | R             |
        Others         |                | R             |
    """

    message = 'You are not allowed to view the results of this election.'

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, election):
        role = request.user.get_role(election.association)

        if role and role.election:
            return True

        return datetime.now(tz=timezone.utc) > election.ends_at


class VotePermission(permissions.BasePermission):
    """
                       | Permissions |
        Allowed voters | C           |
        Others         |             |
    """

    message = 'You are not allowed to vote to this election.'

    def has_permission(self, request, view):
        return request.method in ('POST',)
