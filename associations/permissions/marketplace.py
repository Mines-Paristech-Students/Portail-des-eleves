from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Association, Marketplace, Funding, Transaction, Product
from associations.permissions.base_permissions import extract_id


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
            elif 'transactions' in request.path:
                transaction_id = extract_id('transactions', request.path)
                if transaction_id:
                    marketplace_id = Transaction.objects.get(id=transaction_id).product.marketplace.id
            elif 'products' in request.path:
                product_id = extract_id('products', request.path)
                if product_id:
                    marketplace_id = Product.objects.get(id=product_id).marketplace.id
            elif 'funding' in request.path:
                product_id = extract_id('funding', request.path)
                if product_id:
                    marketplace_id = Funding.objects.get(id=product_id).marketplace.id
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


class MarketplacePermission(BasePermission):
    """
               | Enabled | Disabled |\n
        Admin  | CRUD    | CRUD     |\n
        Simple | R       |          |
    """

    message = 'You are not allowed to edit this marketplace.'

    def has_permission(self, request, view):
        role = get_role_in_marketplace(request)

        if role and role.marketplace:
            return True
        else:
            # Simple user.
            marketplace = get_marketplace(request)

            if marketplace:
                if marketplace.enabled and request.method in SAFE_METHODS:
                    return True
            # If the marketplace could not be found, give access to the safe methods.
            elif request.method in SAFE_METHODS:
                return True
        return False


class ProductPermission(BasePermission):
    """
               | Enabled | Disabled |\n
        Admin  | CRUD    | CRUD     |\n
        Simple | CRUD    |          |\n\n

        Same as Marketplace.
    """

    message = 'You are not allowed to edit this product.'
    has_permission = MarketplacePermission.has_permission


class TransactionPermission(BasePermission):
    """
               | Enabled | Disabled |\n
        Admin  | CRU     | CRU      |\n
        Simple | CRU     | R        |
    """

    message = 'You are not allowed to edit this transaction.'

    def has_permission(self, request, view):
        if request.method in ('DELETE', ):
            self.message = 'Transactions cannot be deleted.'
            return False

        role = get_role_in_marketplace(request)
        if role and role.marketplace:
            # Marketplace administrator.
            return True
        else:
            marketplace = get_marketplace(request)

            if marketplace:
                if marketplace.enabled:
                    return True
                else:
                    return request.method in SAFE_METHODS
            # If the marketplace could not be found, give access to the safe methods.
            elif request.method in SAFE_METHODS:
                return True
        return False


class FundingPermission(BasePermission):
    """
               | Enabled | Disabled |\n
        Admin  | CRU     | RU       |\n
        Simple | R       | R        |
    """

    message = 'You are not allowed to access this funding.'

    def has_permission(self, request, view):
        role = get_role_in_marketplace(request)

        if not role or not role.marketplace:
            # Simple user: read permission only.
            self.message = 'You are not allowed to edit this funding because you are not a marketplace administrator.'
            return request.method in SAFE_METHODS
        else:
            # Marketplace administrator.
            marketplace = get_marketplace(request)

            if marketplace:
                if marketplace.enabled:
                    return request.method in SAFE_METHODS or request.method in ('POST', 'PATCH')
                else:
                    return request.method in SAFE_METHODS or request.method in ('PATCH',)
            # If the marketplace could not be found, give access to the safe methods.
            elif request.method in SAFE_METHODS:
                return True
        return False
