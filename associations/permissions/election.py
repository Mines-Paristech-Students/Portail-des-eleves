from datetime import datetime, timezone

from rest_framework import permissions

from associations.models import Association


class ElectionPermission(permissions.BasePermission):
    """
                        | Permissions |
        Election admin  | CRUD        |
        User            | R           |

        From our point of view, no election should be hidden to any user of the site. So, even if some users are not %
        allowed to vote, they are still allowed to see the elections, including the choices, the allowed voters, and
        the results when the election is over.

        This permission DOES NOT handle the endpoints /vote/ and /results/.
    """

    message = 'You are not allowed to edit this election.'

    def has_permission(self, request, view):
        # Only check the POST method, where we have to go through the POSTed data to find a reference to an association.
        # If the association does not exist, return True so the view can handle the error.

        if request.method in ('POST',):
            association_pk = request.data.get('association', None)
            association_query = Association.objects.filter(pk=association_pk)

            if association_query.exists():
                role = request.user.get_role(association_query[0])
                return role and role.election

        return True

    def has_object_permission(self, request, view, election):
        role = request.user.get_role(election.association)

        if role and role.election:  # Election administrator.
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


class BallotPermission(permissions.BasePermission):
    """
                       | Permissions |
        Allowed voters | C           |
        Others         |             |
    """

    message = 'You are not allowed to vote to this election.'

    def has_permission(self, request, view):
        if request.method not in ('POST',):
            return False

        election_pk = view.kwargs.get('election_pk', None)
        election_query = Association.objects.filter(pk=election_pk)

        if election_query.exists():
            return request.user.allowed_elections.filter(id=election_query[0].id).exists()

        return True
