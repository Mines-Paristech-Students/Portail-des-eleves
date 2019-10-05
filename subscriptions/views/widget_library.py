from django.http import JsonResponse
from rest_framework.decorators import api_view

from associations.models import Library


@api_view(["GET"])
def widget_library_view(request, library_id):
    """Displays the most borrowed loanables if they are available"""

    marketplace = Library.objects.get(pk=library_id)

    response = {}

    suggested_loanables = marketplace.loanables.filter(
        real_return_date__is_null=False
    ).all()
    suggested_loanables = sorted(
        suggested_loanables,
        key=lambda loanable: loanable.transactions.filter(buyer=request.user).count(),
        reverse=True,
    )
    response["suggested_loanables"] = suggested_loanables[:5]

    return JsonResponse(response)
