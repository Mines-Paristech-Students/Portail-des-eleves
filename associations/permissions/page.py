from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association


class PagePermission(BasePermission):
    """
                   | Page |\n
        Page admin | CRUD |\n
        Simple     | R    |
    """

    message = 'You are not allowed to edit this page.'

    def has_permission(self, request, view):
        try:
            association = Association.objects.get(pk=view.kwargs['association_pk'])
        except ObjectDoesNotExist:
            # The association does not exist, return True so the view can raise a 404.
            return True

        role = request.user.get_role(association)

        if role and role.page:
            # News administrator.
            return True
        else:
            return request.method in SAFE_METHODS