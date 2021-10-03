from rest_framework import permissions


class CoursePermission(permissions.BasePermission):
    """
                         | Association |
    Global administrator | CRUD        |
    User                 | R           |
    """

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or request.user.is_staff


class FormPermission(permissions.BasePermission):
    """
                         | Association |
    Global administrator | CRUD        |
    User                 | R           |
    """

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or request.user.is_staff
