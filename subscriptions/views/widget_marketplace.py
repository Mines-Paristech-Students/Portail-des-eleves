from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def widget_marketplace_view(request, marketplace_id):
    return Response("Not implemented yet", status=501)
