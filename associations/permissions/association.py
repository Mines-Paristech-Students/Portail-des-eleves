from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.permissions.utils import check_permission_from_post_data


class AssociationPermission(BasePermission):
    """
                             | Association |
        Global administrator | CRUD        |
        User                 | R           |
    """

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_staff


class RolePermission(BasePermission):
    """
                                  | Role |
        Association administrator | CRUD |
        Association member        | R    |
        User                      | R    |
    """

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method in ('POST',):
            return check_permission_from_post_data(request, 'is_admin')

        return True

    def has_object_permission(self, request, view, association):
        if request.method in SAFE_METHODS:
            return True

        role = request.user.get_role(association)
        return role and role.is_admin

def extract_id(*args, **kwargs):
    pass