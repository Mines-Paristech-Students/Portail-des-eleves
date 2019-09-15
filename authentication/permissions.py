from rest_framework.permissions import BasePermission, SAFE_METHODS


class ProfilePermission(BasePermission):
    """
               | Own profile | Another user |
        Admin  | RU          | RU           |
        Simple | RU          | R            |

        The fields which can be updated are specified in the UserSerializer.
    """

    message = 'You are not allowed to edit this profile.'

    def has_permission(self, request, view):
        if request.method in ('POST', 'DELETE',):
            return False

        return True

    def has_object_permission(self, request, view, target_user):
        if request.user.is_admin:
            return True
        else:
            if request.method in SAFE_METHODS:
                return True
            elif request.method in ('PATCH', ):
                return target_user.id == request.user.id

        return False
