from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.permissions.utils import check_permission_from_post_data


class EventsPermission(BasePermission):
    """
                     | Permissions |
        Events admin | CRUD        |
        Simple       | R           |

        The customized actions 'join' and 'leave' rely on a GET (R).
    """

    message = "You are not allowed to edit this event."

    def has_permission(self, request, view):
        if request.method in ("POST",):
            return check_permission_from_post_data(request, "event")

        return True

    def has_object_permission(self, request, view, election):
        role = request.user.get_role(election.association)

        if role and role.event:  # Events administrator.
            return True
        else:
            return request.method in SAFE_METHODS
