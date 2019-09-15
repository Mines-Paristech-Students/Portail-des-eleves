from rest_framework.permissions import BasePermission, SAFE_METHODS


class ProfilePermission(BasePermission):
    """
               | Own profile | Another user |
        Admin  | CRUD        | CRUD         |
        Simple | RU          | R            |
    """

    message = 'You are not allowed to edit this profile.'

    def has_permission(self, request, view):
        if request.user.is_admin:
            return True
        else:
            return request.method in SAFE_METHODS + ('PATCH', )

    def has_object_permission(self, request, view, target_user):
        if request.user.is_admin:
            return True
        else:
            if request.method in SAFE_METHODS:
                return True
            elif request.method in ('PATCH', ):
                return target_user.id == request.user.id

        return False
