from rest_framework import permissions


class CoursePermission(permissions.BasePermission):
    """
    TODO: Define a group of people that can add courses
    TODO: Add endpoints for teachers to modify courses

                             | Association |
        Global administrator | CRUD        |
        User                 | R           |
    """

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_staff



class FormPermission(permissions.BasePermission):
    """
                             | Association |
        Global administrator | CRUD        |
        User                 | R           |
    """

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or request.user.is_staff