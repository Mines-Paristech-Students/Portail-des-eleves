from django.core.exceptions import SuspiciousOperation
from rest_framework import permissions

from associations.models import (
    Association,
    Role,
    Product,
    Page,
    Loanable,
    Loan,
    Media,
    Event,
    Choice,
)
from authentication.models import User
from forum.models import Theme, MessageForum, Topic
from tags.models import Namespace, Tag


def get_parent_object(obj):
    """ returns the 'parent' object ie the one on which the scope is applied """

    mappers = {
        # Associations
        Association: lambda x: x,
        Choice: lambda x: x.election.association,
        Event: lambda x: x.association,
        Media: lambda x: x.association,
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
        role = user.get_role(parent)
        return role and role.administration_permission
    elif isinstance(parent, Theme):
        return user.is_admin
    else:
        raise NotImplementedError("Model {} is not supported".format(instance))


def user_can_link_tag_to(user: User, tag: Tag, instance):
    parent = get_parent_object(instance)
    if (
        not isinstance(
            parent, Namespace.SCOPED_TO_MODELS[tag.namespace.scoped_to_model]
        )
        or parent.id != tag.namespace.scoped_to_pk
    ):
        return False

    if isinstance(parent, Association):
        role = user.get_role(parent)
        return bool(role)
    elif isinstance(parent, Theme):
        return user.is_admin
    elif parent is None:
        return True
    else:
        raise NotImplementedError("Model {} is not supported".format(instance))


class NamespacePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            scoped_to_model = request.data.get("scoped_to_model")
            scoped_to_pk = request.data.get("scoped_to_pk")

            if scoped_to_model != "global" and (
                scoped_to_model is None or scoped_to_pk is None
            ):
                raise SuspiciousOperation()

            if scoped_to_model == "global":
                return request.user.is_admin

            instance = Tag.get_linked_instance(scoped_to_model, scoped_to_pk)
            return can_manage_tags_for(request.user, instance)

        return True

    def has_object_permission(self, request, view, namespace):
        if namespace.scoped_to_model == "global":
            return request.user.is_admin

        instance = namespace.scoped_to
        return can_manage_tags_for(request.user, instance)


class ManageTagPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            namespace = Namespace.objects.get(pk=request.data.get("namespace"))
            instance = namespace.scoped_to
            if instance:
                return can_manage_tags_for(request.user, instance)
            else:
                return request.user.is_admin
        return True

    def has_object_permission(self, request, view, tag):
        namespace = tag.namespace
        if Namespace.SCOPED_TO_MODELS[namespace.scoped_to_model] is None:
            return request.user.is_admin
        else:
            instance = namespace.scoped_to
            return can_manage_tags_for(request.user, instance)
