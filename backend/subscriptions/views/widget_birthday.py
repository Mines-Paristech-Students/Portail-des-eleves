from rest_framework.decorators import api_view

from authentication.views import get_birthdays


@api_view(["GET"])
def widget_birthday_view(request):
    """
    :return: A JSON object with one key, `birthdays`, which is a list of objects `{"day", "month", "users"}`.
    """

    return get_birthdays(request._request, 7)
