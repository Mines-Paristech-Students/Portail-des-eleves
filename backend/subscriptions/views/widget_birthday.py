from rest_framework.decorators import api_view

from authentication.views import get_birthdays


@api_view(["GET"])
def widget_birthday_view(request):
    return get_birthdays(request, 7)
