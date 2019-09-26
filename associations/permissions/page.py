from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.permissions.utils import check_permission_from_post_data


class PagePermission(BasePermission):
    """
                   | Page |
        Page admin | CRUD |
        Simple     | R    |
    """

    message = "You are not allowed to edit this page."

    def has_permission(self, request, view):
        if request.method in ("POST",):
            return check_permission_from_post_data(request, "page")

        return True

    def has_object_permission(self, request, view, page):
        role = request.user.get_role(page.association)
        return request.method in SAFE_METHODS or (role and role.page)
