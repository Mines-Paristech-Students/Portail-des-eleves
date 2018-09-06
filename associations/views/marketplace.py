import json

from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import viewsets

from associations.models import Marketplace, Order, Product, User
from associations.serializers import MarketplaceSerializer


class MarketplaceViewSet(viewsets.ModelViewSet):
    queryset = Marketplace.objects.all()
    serializer_class = MarketplaceSerializer


def buy(request):
    return JsonResponse({"coucou": "coucou"})

    user_id = request.POST.get("user")
    products = json.loads(request.POST.get("products"))

    orders, errors = [], []

    for (product_id, quantity) in enumerate(products):

        product = Product.objects.filter(id=product_id)

        if quantity > product.number_left >= 0:
            errors.append({
                product_id: "Il n'y a pas assez de {} ({} demandés, {} restants {})".format(product.name, quantity,
                                                                                           product.number_left)
            })
            continue

        user = request.user.id
        if user_id:
            user = User.objects.filter(id=user_id)

        order = Order(
            product=product,
            buyer=user,
            quantity=quantity,
            value=quantity * product.price,
            status="ORDERED"
        )

        orders.append(order)

    if len(errors) >= 1:
        return JsonResponse(errors)

    for order in orders:
        order.save()

    return JsonResponse({
        "user": user_id,
        "products": products,
        "token": get_token(request),
        "orders": orders
    })
