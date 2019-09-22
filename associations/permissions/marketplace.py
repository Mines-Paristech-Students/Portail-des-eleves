from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.permissions.utils import check_permission_from_post_data


class MarketplacePermission(BasePermission):
    """
               | Enabled | Disabled |
        Admin  | CRUD    | CRUD     |
        Simple | R       |          |
    """

    message = 'You are not allowed to edit this marketplace.'

    def has_permission(self, request, view):
        if request.method in ('POST',):
            return check_permission_from_post_data(request, 'marketplace')

        return True

    def has_object_permission(self, request, view, marketplace):
        role = request.user.get_role(marketplace.association)

        if role and role.marketplace:  # Marketplace administrator.
            return True
        else:
            return marketplace.enabled and request.method in SAFE_METHODS


class ProductPermission(BasePermission):
    """
               | Enabled | Disabled |
        Admin  | CRUD    | CRUD     |
        Simple | CRUD    |          |

        Same as Marketplace.
    """

    message = 'You are not allowed to edit this product.'
    has_permission = MarketplacePermission.has_permission
    has_object_permission = MarketplacePermission.has_object_permission


class TransactionPermission(BasePermission):
    """
               | Enabled | Disabled |
        Admin  | CRU     | CRU      |
        Simple | CRU     | R        |
    """

    message = 'You are not allowed to edit this transaction.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method in ('DELETE',):
            self.message = 'Transactions cannot be deleted.'
            return False

        if request.method in ('POST',):
            return check_permission_from_post_data(request, 'marketplace')

        return True

    def has_object_permission(self, request, view, marketplace):
        # We have to put it a second time here, because when retrieving, both has_permission and has_object_permission
        # will be called.
        if request.method in SAFE_METHODS:
            return True

        role = request.user.get_role(marketplace.association)
        return role and role.marketplace


class FundingPermission(BasePermission):
    """
               | Enabled | Disabled |
        Admin  | CRU     | RU       |
        Simple | R       | R        |
    """

    message = 'You are not allowed to access this funding.'

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method in ('DELETE',):
            self.message = 'Fundings cannot be deleted.'
            return False

        if request.method in ('POST',):
            return check_permission_from_post_data(request, 'marketplace')

    def has_object_permission(self, request, view, funding):
        # We have to put it a second time here, because when retrieving, both has_permission and has_object_permission
        # will be called.
        if request.method in SAFE_METHODS:
            return True

        if request.method in ('POST',):
            if not funding.marketplace.enabled:
                return False

        role = request.user.get_role(funding.association)
        return role and role.marketplace
