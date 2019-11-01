from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def widget_repartition_view(request):
    # todo once repartition branch is merged
    return Response("Not implemented yet", status=501)
