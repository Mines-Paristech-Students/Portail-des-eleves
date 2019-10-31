from django.db.models import Count, Q
from django.http import JsonResponse
from rest_framework.decorators import api_view

from associations.models import Library


@api_view(["GET"])
def widget_library_view(request, library_id):
    """Displays the most borrowed loanables if they are available"""

    library = Library.objects.get(pk=library_id)

    response = {}

    suggested_loanables = (
        library.loanables.annotate(
            number_of_borrow=Count(
                "loans", filter=Q(user=request.user)
            )
        )
        .order_by("-number_of_borrow")
        .filter(loans_real_return_date__is_null=False)[0:5]
        .all()
    )
    response["suggested_loanables"] = suggested_loanables

    return JsonResponse(response)
