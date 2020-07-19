from rest_framework import permissions


class TutoringPermission(permissions.BasePermission):
    message = "request not allowed"

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, tutoring):
        if request.method in permissions.SAFE_METHODS:
            self.message = "You are not allowed to see this tutorings."

            return (
                    request.user.is_staff  # Administrators can always retrieve.
                    or tutoring.is_active
            )  # Published polls are public.
        elif request.method in ("PATCH",):
            self.message = "You are not allowed to update this tutorings."

            return request.user.is_staff  # Administrators can always update
        elif request.method in ("DELETE",):
            self.message = "You are not allowed to delete this tutorings."

            return request.user.is_staff
        elif request.method in ("POST",):
            return True

        return False


class ApplyTutorPermission(permissions.BasePermission):
    """
                  | Not active | Active |
        Anyone    |            | C      |
    """

    message = "You are not allowed to apply for this tutor position."

    def has_permission(self, request, view):
        return request.method in ("POST",)

    def has_object_permission(self, request, view, tutoring):
        return tutoring.is_active


class ApplicationPermission(permissions.BasePermission):
    message = "You are not allowed to apply."

    def has_permission(self, request, view):
        return request.user.is_staff

    def has_object_permission(self, request, view, tutoring):
        return True
