from decimal import Decimal

from django.http import JsonResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.db.models import Q

from rest_framework import viewsets, filters, status, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from url_filter.integrations.drf import DjangoFilterBackend

from associations.models import Marketplace, Transaction, Product, Funding
from associations.permissions import IsAssociationMember, IfMarketplaceAdminThenCRUDElseR, \
    IfMarketplaceEnabledThenCRUElseRAndMarketplaceAdminOnlyCRU, \
    IfMarketplaceEnabledThenCRUDElseRAndMarketplaceAdminOnlyCRUD
from associations.permissions.base_permissions import _get_role_for_user
from associations.serializers import MarketplaceSerializer, TransactionSerializer, ProductSerializer, \
    FundingSerializer, UpdateTransactionSerializer, CreateTransactionSerializer
from authentication.models import User


class MarketplaceViewSet(viewsets.ModelViewSet):
    queryset = Marketplace.objects.all()
    serializer_class = MarketplaceSerializer
    permission_classes = (IfMarketplaceAdminThenCRUDElseR,
                          IfMarketplaceEnabledThenCRUDElseRAndMarketplaceAdminOnlyCRUD,)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IfMarketplaceAdminThenCRUDElseR,
                          IfMarketplaceEnabledThenCRUDElseRAndMarketplaceAdminOnlyCRUD,)

    filter_backends = (filters.SearchFilter,)
    search_fields = ("name",)

    def get_queryset(self):
        """The user has access to the products coming from every enabled marketplace and to the products of every
        marketplace she is a library administrator of."""

        # The library for which the user is library administrator.
        marketplaces = [role.association.marketplace for role in self.request.user.roles.all() if role.marketplace]

        return Product.objects.filter(Q(marketplace__enabled=True) | Q(marketplace__in=marketplaces))


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = (IfMarketplaceEnabledThenCRUElseRAndMarketplaceAdminOnlyCRU,)

    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('product', 'status', 'buyer', 'date')

    def get_queryset(self):
        """The user has access to all of her transactions and to the transactions of every marketplace she is an
        administrator of."""

        # The marketplaces for which the user is administrator.
        marketplaces = [role.association.marketplace for role in self.request.user.roles.all() if role.marketplace]

        q = Transaction.objects.filter((Q(buyer=self.request.user) & Q(product__marketplace__enabled=True)) |
                                       Q(product__marketplace__in=marketplaces))
        return q

    def get_serializer_class(self):
        if self.action in ('create',):
            return CreateTransactionSerializer
        elif self.action in ('update', 'partial_update'):
            return UpdateTransactionSerializer
        else:
            return TransactionSerializer

    def create(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.get(pk=serializer.validated_data['product'].id)

        # Check if there are enough products remaining.
        if 'quantity' not in serializer.validated_data or \
                product.number_left < serializer.validated_data['quantity']:
            return HttpResponseBadRequest('Not enough products remaining.')

        # Check whether the user can create a Transaction for another user.
        user_role = request.user.get_role(product.marketplace.association)
        user_is_marketplace_admin = user_role is not None and user_role.marketplace

        if not user_is_marketplace_admin:
            if serializer.validated_data['buyer'].id != request.user.id:
                return HttpResponseForbidden('Cannot create a Transaction for another user.')

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class FundingViewSet(mixins.UpdateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ('status', 'user', "date")
    permission_classes = (IsAssociationMember,)

    queryset = Funding.objects.order_by("-id")
    serializer_class = FundingSerializer


class BalanceView(APIView):
    def get(self, request, marketplace_id, user_id):
        user_id = user_id if user_id else request.user.id
        balance = Decimal(0.0)

        role = _get_role_for_user(request.user, marketplace_id)
        if user_id != request.user.id and (role is None or (not role.marketplace and not role.is_admin)):
            return HttpResponseForbidden()

        orders = Transaction.objects.filter(buyer__id=user_id, product__marketplace=marketplace_id)
        fundings = Funding.objects.filter(user__id=user_id, marketplace=marketplace_id)

        for order in orders:
            if order.status == "DELIVERED":
                balance -= order.value

        for funding in fundings:
            if funding.status == "FUNDED":
                balance += funding.value

        return JsonResponse({
            "balance": balance,
            "user": user_id
        })

    def put(self, request, marketplace_id, user_id, format=None):
        role = _get_role_for_user(request.user, marketplace_id)
        if role is None or (not role.marketplace and not role.is_admin):
            return HttpResponseForbidden()

        body = request.data
        user = User.objects.get(pk=user_id)

        try:
            amount = float(body["amount"])
            if amount != 0.0:
                Funding.objects.create(user=user, value=amount, marketplace_id=marketplace_id)

        except ValueError as err:
            return JsonResponse({"status": "error", "message": "NaN given as value argument"}, status="400")

        return JsonResponse({"status": "ok"})
