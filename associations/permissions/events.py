from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association


class EventsPermission(BasePermission):
    """
                     | Event |
        Events admin | CRUD  |
        Simple       | R     |

        The customized actions 'join' and 'leave' rely on a GET (R).
    """

    message = 'You are not allowed to edit this event.'

    def has_permission(self, request, view):
        # Only check the POST method, where we have to go through the POSTed data to find a reference to an association.
        # If the association does not exist, return True so the view can handle the error.

        if request.method in ('POST',):
            association_pk = request.data.get('association', None)
            association_query = Association.objects.filter(pk=association_pk)

            if association_query.exists():
                role = request.user.get_role(association_query[0])
                return role and role.events

        return True

    def has_object_permission(self, request, view, event):
        role = request.user.get_role(event.association)

        if role and role.events:  # Event administrator.
            return True
        else:
            return request.method in SAFE_METHODS
