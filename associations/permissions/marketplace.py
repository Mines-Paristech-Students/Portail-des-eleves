from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Marketplace, Order, Product
from associations.permissions.base_permissions import _get_role_for_user


class CanManageMarketplace(BasePermission):
    message = 'Marketplace management is not allowed.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == 'CREATE':
            if 'marketplace' in request.data:
                org_id = request.data['marketplace']
            elif 'association' in request.data:
                org_id = request.data["association"]
            else:
                return False

            role = _get_role_for_user(request.user, org_id)
            if not role:
                return False
            return role.marketplace or role.is_admin

        return False

    def has_object_permission(self, request, view, obj):

        if isinstance(obj, Marketplace):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.id)
        elif isinstance(obj, Order):
            raise Exception(obj, request)
            if obj.buyer == request.user and request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.product.marketplace.id)
        elif isinstance(obj, Product):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.marketplace.id)
        else:
            raise Exception("Object {} is not supported (yet)".format(obj.__class__))

        if not role:
            return False

        return role.marketplace or role.is_admin


class OrderPermission(BasePermission):
    message = 'You cannot act on this order.'

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Marketplace):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.id)
        elif isinstance(obj, Order):
            if obj.buyer == request.user and request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.product.marketplace.id)
        elif isinstance(obj, Product):
            if request.method in SAFE_METHODS:
                return True

            role = _get_role_for_user(request.user, obj.marketplace.id)
        else:
            raise Exception("Object {} is not supported (yet)".format(obj.__class__))

        if not role:
            return False

        return role.marketplace or role.is_admin
