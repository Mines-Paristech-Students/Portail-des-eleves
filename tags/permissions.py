from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions

from associations.models import Association, Role, Product, Page, Loanable, Loan, Folder, File, Event, Choice
from associations.permissions.base_permissions import _get_role_for_user
from forum.models import Theme, MessageForum, Topic
from tags.models import Namespace, Tag


def _get_parent_object(obj):
    """ returns the 'parent' object ie the one on which the scope is applied """

    mappers = {
        # Associations
        Association: lambda x: x,
        Choice: lambda x: x.election.association,
        Event: lambda x: x.association,
        File: lambda x: x.association,
        Folder: lambda x: x.association,
        Loan: lambda x: x.loanable.library.association,
        Loanable: lambda x: x.library.association,
        Page: lambda x: x.association,
        Product: lambda x: x.library.association,
        Role: lambda x: x.association,

        # Forum
        Theme: lambda x: x,
        Topic: lambda x: x.theme,
        MessageForum: lambda x: x.topic.theme,
    }

    mapper = mappers.get(obj.__class__)
    if mapper:
        return mapper(obj)
    else:
        return None


def _check_can_access_scoped(user, instance):
    parent = _get_parent_object(instance)

    if isinstance(parent, Association):
        role = _get_role_for_user(user, parent)
        return role and role.is_admin
    elif isinstance(parent, Theme):
        return user.is_admin
    elif parent is None:
        return user.is_admin
    else:
        raise NotImplementedError("Model {} is not supported".format(instance))


def _check_can_access_scope(user, scope, scoped_object_pk):
    if scope not in Namespace.SCOPES:
        return True  # let return 404 later

    model = Namespace.SCOPES.get(scope)
    if model is None:
        return user.is_admin

    try:
        instance = model.objects.get(pk=scoped_object_pk)
    except ObjectDoesNotExist:
        return True  # let return 404 later

    return _check_can_access_scoped(user, instance)


class NamespacePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == "POST":
            scope = request.data.get("scope")
            scoped_to = request.data.get("scoped_to")
            return _check_can_access_scope(request.user, scope, scoped_to)

        return True

    def has_object_permission(self, request, view, namespace):
        return _check_can_access_scope(request.user, namespace.scope, namespace.scoped_to)
