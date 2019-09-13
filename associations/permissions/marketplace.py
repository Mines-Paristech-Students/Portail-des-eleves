from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association, Marketplace, Order, Product
from associations.permissions.base_permissions import extract_id, _get_role_for_user


def get_marketplace(request):
    """
        Parse the URL and the POST data to get the marketplace related to the request.\n
        For instance, when GETting products/5/, the method will return the marketplace of the loanable which ID is 5.\n
        Or, if POSTing data to marketplace/ (to create a new marketplace), the method will return the content of the id
        field of the posted data.
    """
    if request.user is not None:
        marketplace_id = None

        try:
            if 'marketplace' in request.data:
                marketplace_id = request.data['marketplace']
            elif 'product' in request.data:
                marketplace_id = Product.objects.get(id=request.data['product']).marketplace.id
            elif 'orders' in request.path:
                order_id = extract_id('order', request.path)
                if order_id:
                    marketplace_id = Order.objects.get(id=order_id).product.marketplace.id
            elif 'products' in request.path:
                product_id = extract_id('products', request.path)
                if product_id:
                    marketplace_id = Product.objects.get(id=product_id).marketplace.id
            elif 'marketplace' in request.path:
                marketplace_id = extract_id('marketplace', request.path)
        except ObjectDoesNotExist:
            pass

        if marketplace_id is not None:
            marketplace = None

            try:
                marketplace = Marketplace.objects.get(id=marketplace_id)
            except ObjectDoesNotExist:
                pass

            return marketplace

    return None


def get_role_in_marketplace(request):
    """
        Parse the URL and the POST data to get the role of the user in the marketplace related to the request.\n
    """
    role = None

    # Tricky case: when one creates a new marketplace. In that case, the marketplace object does not exist yet.
    # We have to use an association parameter to check the roles.
    if 'marketplace' in request.path and request.method == 'POST':
        if 'association' in request.data:
            role = request.user.get_role(Association.objects.get(pk=request.data['association']))
    else:
        marketplace = get_marketplace(request)

        if marketplace:
            role = request.user.get_role(marketplace.association)

    return role


class IfMarketplaceAdminThenCRUDElseCRU(BasePermission):
    """
        Every user has the create / read / update permissions.\n
        An user has the delete permission iff the user is a marketplace administrator of the edited marketplace.
    """

    message = 'You are not allowed to edit this marketplace because you are not an administrator of this marketplace.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS or request.method in ('POST', 'PATCH'):
            return True

        return IfMarketplaceAdminThenCRUDElseR().has_permission(request, view)


class IfMarketplaceAdminThenCRUDElseR(BasePermission):
    """
        Every user has the read permission.\n
        An user has the CRUD permissions iff the user is a marketplace administrator of the edited marketplace.
    """

    message = 'You are not allowed to edit this marketplace because you are not an administrator of this marketplace.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        role = get_role_in_marketplace(request)

        if role is not None:
            return role.marketplace

        return False


class IfMarketplaceEnabledThenCRUDElseMarketplaceAdminOnlyCRUD(BasePermission):
    """
        If the marketplace is enabled, every user has every permission.\n
        If the marketplace is disabled, an user has the write permission iff the user is a marketplace administrator of
        the edited marketplace.
        If the marketplace does not exist, only the safe methods are allowed.
    """
    message = 'You are not allowed to view this marketplace because it is disabled.'

    def has_permission(self, request, view):
        role = get_role_in_marketplace(request)

        if role is not None and role.marketplace:
            # Marketplace administrator, give all the rights.
            return True
        else:
            marketplace = get_marketplace(request)

            if marketplace:
                # The marketplace is enabled, give all the rights.
                return marketplace.enabled
            # If the marketplace could not be found, give access to the safe methods.
            elif request.method in SAFE_METHODS:
                return True
        return False


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
