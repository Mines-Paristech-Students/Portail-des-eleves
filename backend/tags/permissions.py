from rest_framework import permissions

from associations.models import (
    Association,
    Choice,
    Election,
    Event,
    Media,
    Funding,
    Library,
    Loanable,
    Loan,
    Marketplace,
    Page,
    Product,
    Transaction,
    Role,
)
from authentication.models import User
from tags.models import Namespace, Tag


def get_parent_object(obj):
    """Return the 'parent' object ie the one to which the scope is applied."""

    mappers = {
        # Associations
        Association: lambda x: x,
        Choice: lambda x: x.election.association,
        Election: lambda x: x.association,
        Event: lambda x: x.association,
        Funding: lambda x: x.marketplace.association,
        Library: lambda x: x.association,
        Loanable: lambda x: x.library.association,
        Loan: lambda x: x.loanable.library.association,
        Marketplace: lambda x: x.association,
        Media: lambda x: x.association,
        Page: lambda x: x.association,
        Product: lambda x: x.marketplace.association,
        Transaction: lambda x: x.product.marketplace.association,
        Role: lambda x: x.association,
    }

    mapper = mappers.get(obj.__class__)
    if mapper:
        return mapper(obj)
    else:
        raise ValueError(f"No context associated to {obj}")


def can_manage_tags_for(user, instance):
    parent = get_parent_object(instance)

    if isinstance(parent, Association):
        role = user.get_role(parent)
        return role and role.administration_permission
    else:
        raise NotImplementedError("Model {} is not supported".format(instance))


def user_can_link_tag_to(user: User, tag: Tag, instance):
    parent = get_parent_object(instance)

    # Check if the instance can be tagged with this namespace.
    if (
        not isinstance(
            parent, Namespace.SCOPED_TO_MODELS[tag.namespace.scoped_to_model]
        )
        or parent.id != tag.namespace.scoped_to_pk
    ):
        return False

    # Check if the user has the permission.
    if isinstance(parent, Association):
        role = user.get_role(parent)
        return bool(role)
    elif parent is None:
        return True
    else:
        raise NotImplementedError("Model {} is not supported".format(instance))


class NamespacePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # `request.data != []` has to be here because, for some reason, DRF makes a POST request when the user just
        # asked for a GET request (it has to do with the form displayed in the viewsets).
        if request.method == "POST" and len(request.data) > 0:
            scoped_to_model = request.data.get("scoped_to_model")
            scoped_to_pk = request.data.get("scoped_to_pk")
            # Only the admins can edit a global namespace.
            if scoped_to_model == "global":
                return request.user.is_admin
            # Or, both parameters have to be provided.
            if scoped_to_model is None or scoped_to_pk is None:
                return False

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
        # Same as above for `request.data != []`.
        if request.method == "POST" and len(request.data) > 0:
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
