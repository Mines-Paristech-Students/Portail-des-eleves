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
        return request.method not in ('POST', 'DELETE',)

    def has_object_permission(self, request, view, target_user):
        if request.user.is_admin:
            return True
        else:
            return request.method in SAFE_METHODS or \
                   (request.method in ('PATCH', ) and target_user.id == request.user.id)
