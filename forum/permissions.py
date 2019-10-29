from rest_framework import permissions


class ThemePermission(permissions.BasePermission):
    """
                             | Theme |
        Simple user          | R     |
        Global administrator | CRUD  |
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_staff


class TopicPermission(permissions.BasePermission):
    """
                             | Topic |
        Simple user          | CR    |
        Global administrator | CRUD  |
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS + ("POST",):
            return True

        return request.user.is_staff


class MessagePermission(permissions.BasePermission):
    """
                             | Author | Not author |
        Simple user          | CRUD   | R          |
        Global administrator | CRUD   | RUD        |
    """

    def has_permission(self, request, view):
        # If the method is a `SAFE_METHOD`, permission is granted.
        # If the method is POST, the serializer already makes sure that an user can only post on their name, so the
        # permission is de facto granted.
        # The other methods (corresponding to UPDATE and DELETE) are managed by `has_object_permission`.
        return True

    def has_object_permission(self, request, view, message):
        # See the comment on `has_permission`.
        if request.method in permissions.SAFE_METHODS + ("POST",):
            return True

        return message.author == request.user or request.user.is_staff
