from rest_framework.exceptions import NotFound
from rest_framework.permissions import BasePermission, SAFE_METHODS

from associations.models import Marketplace, Product
from associations.permissions.utils import check_permission_from_post_data


class MarketplacePermission(BasePermission):
    """
           | Enabled | Disabled |
    Admin  | CRUD    | CRUD     |
    Simple | R       |          |
    """

    message = "You are not allowed to edit this marketplace."

    def has_permission(self, request, view):
        if request.method in ("POST",):
            return check_permission_from_post_data(request, "marketplace")

        return True

    def has_object_permission(self, request, view, marketplace):
        role = request.user.get_role(marketplace.association)

        if role and (role.marketplace or role.administration):
            return True
        else:
            return marketplace.enabled and request.method in SAFE_METHODS


class ProductPermission(BasePermission):
    """
           | Enabled | Disabled |
    Admin  | CRUD    | CRUD     |
    Simple | R       |          |
    """

    message = "You are not allowed to edit this product."

    def has_permission(self, request, view):
        if request.method in ("POST",):
            market_pk = request.data.get("marketplace", None)
            market_query = Marketplace.objects.filter(pk=market_pk)

            if market_query.exists():
                market = market_query[0]
                role = request.user.get_role(market.association)

                return role and role.marketplace  # Marketplace administrator only.
            else:
                raise NotFound("The requested marketplace does not exist.")

        return True

    def has_object_permission(self, request, view, product):
        role = request.user.get_role(product.marketplace.association)

        if role and role.marketplace:
            return True  # Marketplace administrator: all the rights.
        else:
            return request.method in SAFE_METHODS and product.marketplace.enabled


class TransactionPermission(BasePermission):
    """
           | Enabled | Disabled |
    Admin  | CRU     | CRU      |
    Simple | CRU     | R        |

    A simple user may only see or update their own loan.
    """

    message = "You are not allowed to edit this transaction."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method in ("DELETE",):
            self.message = "Transactions cannot be deleted."
            return False

        if request.method in ("POST",):
            product_pk = request.data.get("product", None)
            product_query = Product.objects.filter(pk=product_pk)

            if product_query.exists():
                return product_query[0].marketplace.enabled
            else:
                raise NotFound("The requested product does not exist.")

        return True

    def has_object_permission(self, request, view, transaction):
        role = request.user.get_role(transaction.product.marketplace.association)

        if role and role.marketplace:
            return True  # Marketplace administrator
        else:
            return transaction.buyer == request.user and (
                transaction.product.marketplace.enabled
                or request.method in SAFE_METHODS
            )


class FundingPermission(BasePermission):
    """
           | Enabled | Disabled |
    Admin  | CRU     | RU       |
    Simple | R       | R        |
    """

    message = "You are not allowed to access this funding."

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method in ("DELETE",):
            self.message = "Fundings cannot be deleted."
            return False

        if request.method in ("POST",):
            market_pk = request.data.get("marketplace", None)
            market_query = Marketplace.objects.filter(pk=market_pk)

            if market_query.exists():
                market = market_query[0]
                role = request.user.get_role(market.association)
                return role and role.marketplace
            else:
                raise NotFound("The requested marketplace does not exist.")

        return True

    def has_object_permission(self, request, view, funding):
        role = request.user.get_role(funding.marketplace.association)

        if role and role.marketplace:
            return True  # Marketplace administrator
        else:
            return funding.user == request.user and request.method in SAFE_METHODS
