from django.core.exceptions import SuspiciousOperation
from rest_framework import permissions

from associations.models import (
    Association,
    Role,
    Product,
    Page,
    Loanable,
    Loan,
    Folder,
    File,
    Event,
    Choice,
)
from associations.permissions.base_permissions import _get_role_for_user
from forum.models import Theme, MessageForum, Topic
from tags.models import Namespace, Tag


def get_parent_object(obj):
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
        Product: lambda x: x.marketplace.association,
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
        raise Exception("No context associated to {}".format(obj))


def can_manage_tags_for(user, instance):
    parent = get_parent_object(instance)

    if isinstance(parent, Association):
        role = _get_role_for_user(user, parent)
        return role and role.is_admin
    elif isinstance(parent, Theme):
        return user.is_admin
    else:
        raise NotImplementedError("Model {} is not supported".format(instance))


def can_manage_links_for(user, instance):
    parent = get_parent_object(instance)

    if isinstance(parent, Association):
        role = _get_role_for_user(user, parent)
        return role and role.is_admin
    elif isinstance(parent, Theme):
        return user.is_admin
    elif parent is None:
        return True
    else:
        raise NotImplementedError("Model {} is not supported".format(instance))


class NamespacePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            scope = request.data.get("scope")
            scoped_to = request.data.get("scoped_to")

            if scope != "global" and (scope is None or scoped_to is None):
                raise SuspiciousOperation()

            if scope == "global":
                return request.user.is_admin

            instance = Tag.LINKS[scope].objects.get(pk=scoped_to)
            return can_manage_tags_for(request.user, instance)

        return True

    def has_object_permission(self, request, view, namespace):
        if namespace.scope == "global":
            return request.user.is_admin

        instance = Namespace.SCOPES[namespace.scope].objects.get(pk=namespace.scoped_to)
        return can_manage_tags_for(request.user, instance)


class ManageTagPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            namespace = Namespace.objects.get(pk=request.data.get("namespace"))
            scope = Namespace.SCOPES[namespace.scope]
            if scope:
                instance = scope.objects.get(pk=namespace.scoped_to)
                return can_manage_tags_for(request.user, instance)
            else:
                return request.user.is_admin
        return True

    def has_object_permission(self, request, view, tag):
        namespace = tag.namespace
        if Namespace.SCOPES[namespace.scope] is None:
            return request.user.is_admin
        else:
            print(namespace)
            instance = Namespace.SCOPES[namespace.scope].objects.get(
                pk=namespace.scoped_to
            )
            return can_manage_tags_for(request.user, instance)
