from decimal import Decimal

from django.http import JsonResponse, Http404, HttpResponseForbidden, HttpResponseBadRequest
from rest_framework import viewsets, filters, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from url_filter.integrations.drf import DjangoFilterBackend

from associations.models import Marketplace, Order, Product, Funding
from associations.permissions import IsAssociationMember, OrderPermission, IfMarketplaceAdminThenCRUDElseCRU, \
    IfMarketplaceAdminThenCRUDElseR, IfMarketplaceEnabledThenCRUDElseMarketplaceAdminOnlyCRUD
from associations.permissions.base_permissions import _get_role_for_user
from associations.serializers import MarketplaceSerializer, OrderSerializer, ProductSerializer, FundingSerializer
from authentication.models import User


class MarketplaceViewSet(viewsets.ModelViewSet):
    queryset = Marketplace.objects.all()
    serializer_class = MarketplaceSerializer
    permission_classes = (IfMarketplaceAdminThenCRUDElseR, IfMarketplaceEnabledThenCRUDElseMarketplaceAdminOnlyCRUD,)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IfMarketplaceAdminThenCRUDElseCRU, IfMarketplaceEnabledThenCRUDElseMarketplaceAdminOnlyCRUD)
    filter_backends = (filters.SearchFilter,)
    search_fields = ("name",)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = (OrderPermission,)
    filter_backends = (DjangoFilterBackend,)
    filter_fields = ("product", 'status', 'buyer', "date")

    def create(self, request, **kwargs):

        body = request.data
        user_id = body["user"] if "user" in body else None
        products = body["products"]

        orders, errors = [], []

        for product in products:

            quantity = int(product["quantity"])
            product = Product.objects.get(pk=product["id"])

            if quantity > product.number_left >= 0:
                errors.append({
                    product.id: "Il n'y a pas assez de {} ({} demandés, {} restants)".format(
                        product.name, quantity, product.number_left
                    )
                })
                continue

            status = "ORDERED"
            user = request.user
            if user_id:
                user = User.objects.get(id=user_id)
                status = "DELIVERED"

            order = Order(
                product=product,
                buyer=user,
                quantity=quantity,
                value=quantity * product.price,
                status=status
            )

            product.number_left -= quantity

            orders.append(order)

        if len(errors) >= 1:
            return JsonResponse(errors)

        for order in orders:
            order.save()
            order.product.save()

        return JsonResponse(OrderSerializer(orders, many=True).data, safe=False)

    def list(self, request, *args, **kwargs):
        marketplace_id = request.GET.get("marketplace")
        if not marketplace_id:
            return HttpResponseBadRequest("Marketplace id must be given")

        user = request.user
        role = _get_role_for_user(user, marketplace_id)

        queryset = Order.objects.filter(product__marketplace__id=marketplace_id)

        if not role or not (role.marketplace or role.is_admin):
            queryset = queryset.filter(buyer__id=user.id)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)


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

        orders = Order.objects.filter(buyer__id=user_id, product__marketplace=marketplace_id)
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
