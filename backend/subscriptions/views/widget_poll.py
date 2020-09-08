import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response

from polls.models import Poll
from polls.serializers import ReadOnlyPollSerializer


@api_view(["GET"])
def widget_poll_view(request):
    """
        Display the active polls.

        :return: A JSON object with one key, `active_polls`, containing a list of serialized `Poll` objects.
    """

    activation_date = request.GET.get("date", datetime.date.today().strftime("%Y-%m-%d"))
    return Response(
        {
            "polls": ReadOnlyPollSerializer(
                many=True, context={"request": request}
            ).to_representation([poll for poll in Poll.objects.filter(publication_date=activation_date).all()])
        }
    )
