from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.permissions.utils import check_permission_from_post_data
from authentication.models import User


class AssociationPermission(BasePermission):
    """
                         | Association |
    Global administrator | CRUD        |
    User                 | R           |
    """

    message = "You do not have the permission to edit this association."

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_staff

    def has_object_permission(self, request, view, assoc):
        user = User.objects.get(pk=request.user.id)
        if assoc is not None:
            is_hidden = assoc.is_hidden
            if user.is_in_first_year and is_hidden:
                return False
        return request.method in SAFE_METHODS or request.user.is_staff


class RolePermission(BasePermission):
    """
                              | Own association role | Other association role |
    Global administrator      | CRU                  | CRU                    |
    Association administrator | CRUD                 | R                      |
    Association member        | R                    | R
    User                      | R                    | R
    """

    message = "You do not have the permission to edit this role."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method in ("POST",):
            return check_permission_from_post_data(
                request, "administration", allow_staff=True
            )

        return True

    def has_object_permission(self, request, view, role):
        # `role` is the retrieved / updated / deleted role.
        # `user_role` is the role of the user making the request.

        user_role = request.user.get_role(role.association)

        if request.method in SAFE_METHODS:
            return True
        elif request.method in ("DELETE",):
            return user_role and user_role.administration
        elif request.method in ("PATCH",):
            return (user_role and user_role.administration) or request.user.is_staff

        return False
