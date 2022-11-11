from django.http import HttpRequest
from rest_framework.permissions import SAFE_METHODS, BasePermission


class ProfilePermission(BasePermission):
    """
           | Own profile | Another user |
    Admin  | RU          | RUC           |
    Simple | RU          | R            |

    The fields which can be updated are specified in the UserSerializer.
    """

    message = "You are not allowed to edit this profile."

    def has_permission(self, request: HttpRequest, view):
        if request.method not in ("POST", "DELETE"):
            return True
        if request.method == "POST":
            self.message = "You are not allowed to create a new profile."
            return self.is_api(request) or request.user.is_admin
        return False

    def has_object_permission(self, request, view, target_user):
        if request.user.is_admin:
            return True
        else:
            return request.method in SAFE_METHODS or (
                request.method in ("PATCH",) and target_user.id == request.user.id
            )

    def is_api(self, request: HttpRequest):
        return hasattr(request.user, "is_api") and request.user.is_api
