from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Role, Media


def _get_role_for_user(user, association):
    qs = Role.objects.filter(user=user, association=association)
    if qs.exists():
        return qs[0]
    return None


class CanEditMedia(BasePermission):
    message = "Editing files is not allowed."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == "CREATE":
            if "association" in request.data:
                association = request.data["association"]
            else:
                return False

            role = _get_role_for_user(request.user, association)

            if not role:
                return False

            return role.files

        return True

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if isinstance(obj, Media):
            association = obj.association
        else:
            return True

        role = _get_role_for_user(request.user, association)

        if not role or association is None:
            return False

        return role.files
