from rest_framework import permissions

from associations.models import Association
from associations.permissions.base_permissions import _get_role_for_user
from forum.models import Theme
from tags.models import Namespace


def _check_can_access_scope(user, scope, scoped_object):
    if scope not in Namespace.SCOPES:
        return True  # let return 404 later

    model = Namespace.SCOPES.get(scope)
    if model is None:
        return user.is_admin

    try:
        instance = model.objects.get(pk=scoped_object)
    except:
        return True  # let return 404 later

    if model == Association:
        return _get_role_for_user(user, instance)
    elif model == Theme:
        return user.is_admin
    else:
        raise NotImplementedError("Model {} is not supported".format(model))


class NamespacePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == "POST":
            scope = request.data.get("scope")
            scoped_to = request.data.get("scoped_to")
            return _check_can_access_scope(request.user, scope, scoped_to)

        return True

    def has_object_permission(self, request, view, election):
        return True
