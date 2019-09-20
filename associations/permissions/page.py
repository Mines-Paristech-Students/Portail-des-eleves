from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association


class PagePermission(BasePermission):
    """
                   | Page |
        Page admin | CRUD |
        Simple     | R    |
    """

    message = 'You are not allowed to edit this page.'

    def has_permission(self, request, view):
        if request.method in ('POST',):
            association_request = Association.objects.filter(pk=request.data['association'])

            if association_request.exists():
                role = request.user.get_role(association_request[0])
                return role and role.page

        return True

    def has_object_permission(self, request, view, page):
        role = request.user.get_role(page.association)
        return request.method in SAFE_METHODS or (role and role.page)
