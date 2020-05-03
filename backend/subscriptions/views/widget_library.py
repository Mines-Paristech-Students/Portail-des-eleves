from django.db.models import Count, Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

from associations.models import Library
from associations.serializers import LoanableShortSerializer


@api_view(["GET"])
def widget_library_view(request, library_id):
    """
        Display the five most borrowed loanables of the library if they are available.

        :return: A JSON object with one key, `suggested_loanables`, which is a list of serialized `Loanable` objects.
    """

    library = Library.objects.get(pk=library_id)

    suggested_loanables = (
        library.loanables.annotate(
            number_of_loans=Count("loans", filter=Q(loans__user=request.user))
        )
        .order_by("-number_of_loans")
        .filter(loans__real_return_date__isnull=False)[0:5]
        .all()
    )

    return Response(
        {
            "suggested_loanables": [
                LoanableShortSerializer().to_representation(loanable)
                for loanable in suggested_loanables
            ]
        }
    )
