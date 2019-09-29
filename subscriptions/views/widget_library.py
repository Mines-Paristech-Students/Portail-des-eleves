from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def widget_library_view(request, library_id):
    return Response("Not implemented yet", status=501)
