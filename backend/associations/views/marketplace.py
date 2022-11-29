from decimal import Decimal

import django_filters
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponseForbidden, HttpResponseBadRequest, Http404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status, filters
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

from api.paginator import SmallResultsSetPagination
from associations.models import Marketplace, Product, Transaction, Funding
from associations.permissions import (
    MarketplacePermission,
    ProductPermission,
    TransactionPermission,
    FundingPermission,
)
from associations.serializers import (
    MarketplaceSerializer,
    MarketplaceWriteSerializer,
    ProductSerializer,
    TransactionSerializer,
    CreateTransactionSerializer,
    UpdateTransactionSerializer,
    FundingSerializer,
    CreateFundingSerializer,
    UpdateFundingSerializer,
)
from authentication.models import User
from tags.filters import HasHiddenTagFilter
from tags.filters.taggable import TaggableFilter


class MarketplaceViewSet(viewsets.ModelViewSet):
    queryset = Marketplace.objects.all()
    serializer_class = MarketplaceSerializer
    permission_classes = (MarketplacePermission,)

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return MarketplaceWriteSerializer

        return MarketplaceSerializer


class ProductFilter(TaggableFilter):
    class Meta:
        model = Product
        fields = ("marketplace",)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (ProductPermission,)

    pagination_class = SmallResultsSetPagination

    filter_class = ProductFilter
    filter_backends = (DjangoFilterBackend, SearchFilter, HasHiddenTagFilter)
    search_fields = ("name", "description")

    def get_queryset(self):
        """The user has access to the products coming from every enabled marketplace and to the products of every
        marketplace they are a library administrator of."""

        # The library for which the user is library administrator.
        marketplaces = [
            role.association.marketplace
            for role in self.request.user.roles.all()
            if role.marketplace
        ]

        return Product.objects.filter(
            Q(marketplace__enabled=True) | Q(marketplace__in=marketplaces)
        )


class TransactionFilter(django_filters.FilterSet):
    class Meta:
        model = Transaction
        fields = {
            "product": ["exact"],
            "status": ["exact", "in"],
            "buyer": ["exact"],
            "date": ["exact"],
            "product__marketplace": ["exact"],
        }


class TransactionViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = (TransactionPermission,)

    search_fields = ("product__name",)
    filter_class = TransactionFilter
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
        HasHiddenTagFilter,
    )  # SearchFilter is not enabled by default.

    def get_queryset(self):
        """The user has access to all of their transactions and to the transactions of every marketplace they are an
        administrator of."""

        # The marketplaces for which the user is administrator.
        marketplaces = [
            role.association.marketplace
            for role in self.request.user.roles.all()
            if role.marketplace
        ]

        q = Transaction.objects.filter(
            (Q(buyer=self.request.user) & Q(product__marketplace__enabled=True))
            | Q(product__marketplace__in=marketplaces)
        )
        return q

    def get_serializer_class(self):
        if self.action in ("create",):
            return CreateTransactionSerializer
        elif self.action in ("update", "partial_update"):
            return UpdateTransactionSerializer
        else:
            return TransactionSerializer

    def create(self, request, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.get(pk=serializer.validated_data["product"].id)

        # Check if there are enough products remaining.
        # -1 means there is as much of the product as we want
        if "quantity" not in serializer.validated_data or (
            -1 < product.number_left < serializer.validated_data["quantity"]
        ):
            return HttpResponseBadRequest("Not enough products remaining.")

        # Check whether the user can create a Transaction for another user.
        user_role = request.user.get_role(product.marketplace.association)
        user_is_marketplace_admin = user_role is not None and user_role.marketplace

        if not user_is_marketplace_admin:
            if serializer.validated_data["buyer"].id != request.user.id:
                return HttpResponseForbidden(
                    "Cannot create a Transaction for another user."
                )

        with transaction.atomic():  # make sure the stock is updated iff the transaction is taken into account
            self.perform_create(serializer)
            product.number_left -= serializer.validated_data["quantity"]
            product.save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        old_status = instance.status
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        active_status = ["ORDERED", "VALIDATED", "DELIVERED"]
        disabled_status = ["CANCELLED", "REJECTED", "REFUNDED"]

        product = instance.product

        with transaction.atomic():  # make sure the stock is updated iff the transaction is taken into account
            self.perform_update(serializer)
            new_status = instance.status

            if old_status in active_status and new_status in disabled_status:
                product.number_left += instance.quantity
            elif old_status in disabled_status and new_status in active_status:
                product.number_left -= instance.quantity

            product.save()

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


class FundingViewSet(viewsets.ModelViewSet):
    queryset = Funding.objects.all()
    serializer_class = FundingSerializer
    permission_classes = (FundingPermission,)

    filter_fields = ("status", "user", "date")

    def get_queryset(self):
        """The user has access to all their funding and to the funding of every marketplace they are an administrator
        of."""
        # The marketplaces for which the user is administrator.
        marketplaces = [
            role.association.marketplace
            for role in self.request.user.roles.all()
            if role.marketplace
        ]

        q = Funding.objects.filter(
            Q(user=self.request.user) | Q(marketplace__in=marketplaces)
        )
        return q

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ("update", "partial_update"):
            return UpdateFundingSerializer
        elif self.action in ("create",):
            return CreateFundingSerializer
        else:
            return FundingSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if (
            len(serializer.validated_data) != 1
            and "status" not in serializer.validated_data
        ):
            return HttpResponseForbidden("You are not allowed to update this Funding.")

        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


def compute_balance(user, marketplace):
    balance = Decimal()

    for f in Funding.objects.filter(marketplace=marketplace, user=user):
        if f.value_in_balance:
            balance += f.value

    for t in Transaction.objects.filter(product__marketplace=marketplace, buyer=user):
        if t.value_in_balance:
            balance -= t.value

    return balance


class BalanceView(APIView):
    @staticmethod
    def get_balance_in_json(user, marketplace):
        res = {
            "balance": compute_balance(user, marketplace),
            "marketplace": marketplace.id,
            "user": user.id,
        }

        try:
            res["association"] = {"name": marketplace.association.name}
        except Marketplace.association.RelatedObjectDoesNotExist:
            pass

        return res

    def get(self, request, marketplace_id=None, user_id=None):
        if not marketplace_id:
            # List all the balances of all the marketplaces.
            m = set(
                [f.marketplace for f in Funding.objects.filter(user=self.request.user)]
            )
            m.union(
                set(
                    [
                        f.product.marketplace
                        for f in Transaction.objects.filter(buyer=self.request.user)
                    ]
                )
            )

            return Response(
                {
                    "balances": [
                        self.get_balance_in_json(request.user, marketplace)
                        for marketplace in m
                    ]
                }
            )
        else:
            try:
                marketplace = Marketplace.objects.get(pk=marketplace_id)
            except ObjectDoesNotExist:
                return Http404("This marketplace does not exist.")

            user = User.objects.get(pk=user_id) if user_id else self.request.user
            role = self.request.user.get_role(marketplace.association)

            if not user_id:
                # List the balances of all the users.
                if role and role.marketplace:
                    return Response(
                        {
                            "balances": [
                                self.get_balance_in_json(u, marketplace)
                                for u in User.objects.all()
                            ]
                        }
                    )
                else:
                    return HttpResponseForbidden(
                        "You are not a marketplace administrator."
                    )
            else:
                # Retrieve the balance of one user.
                if user != request.user:
                    if role is None or not role.marketplace:
                        return HttpResponseForbidden(
                            "You are not allowed to view the balance of this user."
                        )

                return Response(self.get_balance_in_json(user, marketplace))
