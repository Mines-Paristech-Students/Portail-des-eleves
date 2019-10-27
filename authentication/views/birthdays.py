from datetime import date, timedelta

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from authentication.models import User
from authentication.utils import Birthday


@api_view(["GET"])
def get_birthdays(request, number_of_days):
    """API endpoint to get birthdays information in the next X days."""

    # Any request with more than 365 days basically mean to fetch all incoming birthdays over the year
    if number_of_days > 365:
        number_of_days = 365

    # Creating a month_idx list with all the month indexes (from 1 to 12) where we look for birthdays If today is
    # Sept. 25 and we want the next 7 days, month_idx will be [09, 10] If today is in Sept. 25 and we want 364 days,
    # month_idx will be [09, 10, 11, 12, 01, 02, 03, 04, 05, 06, 07, 08, 09] 09 is twice in the array,
    # this is important to look have birthdays from 25 Sept at the beginning and birthdays from 1 to 25 Sept at the end
    start = Birthday.from_date(date.today())
    end = Birthday.from_date(date.today() + timedelta(days=number_of_days - 1))
    if start.month > end.month:
        month_idx = [
            i % 12 if i != 12 else 12 for i in range(start.month, end.month + 12 + 1)
        ]
    elif start.month == end.month and start.day > end.day:
        month_idx = [
            i % 12 if i != 12 else 12 for i in range(start.month, end.month + 12 + 1)
        ]
    else:
        month_idx = [i for i in range(start.month, end.month + 1)]

    # Creating a list of User objects having their birthdays between start and end date
    users = []
    if len(month_idx) == 1:
        # Only one month, fetch birthdays between start and end
        users.extend(
            User.objects.all()
            .filter(
                birthday__month=month_idx[0],
                birthday__day__gte=start.day,
                birthday__day__lte=end.day,
            )
            .order_by("birthday__day")
            .all()
        )
    elif len(month_idx) == 2:
        # Only two months, fetch birthdays from start in month 1 and from 1 to end in month 2
        users.extend(
            User.objects.all()
            .filter(birthday__month=month_idx[0], birthday__day__gte=start.day)
            .order_by("birthday__day")
            .all()
        )
        users.extend(
            User.objects.all()
            .filter(birthday__month=month_idx[1], birthday__day__lte=end.day)
            .order_by("birthday__day")
            .all()
        )

    else:  # len(month_idx) > 2
        # More than two months, fetch birthdays from start in month 1, all birthdays from 1 to end in last month,
        # and all birthdays in between
        users.extend(
            User.objects.all()
            .filter(birthday__month=month_idx[0], birthday__day__gte=start.day)
            .order_by("birthday__day")
            .all()
        )
        for i in range(1, len(month_idx) - 1):
            users.extend(
                User.objects.all()
                .filter(birthday__month=month_idx[i])
                .order_by("birthday__day")
                .all()
            )
        users.extend(
            User.objects.all()
            .filter(birthday__month=month_idx[-1], birthday__day__lte=end.day)
            .order_by("birthday__day")
            .all()
        )

    # No more sql request from here
    # Here we just format the answer as a dict
    # keys are Birthday objects (to have 1996-08-28 and 2000-08-28 on the same idx)
    # values are the list of the users having their birthday on the given date
    birthdays = {}
    for user in users:
        bd = Birthday.from_date(user.birthday)

        if bd not in birthdays:
            birthdays[bd] = {"day": bd.day, "month": bd.month, "users": []}

        birthdays[bd]["users"].append(
            {"id": user.id, "first_name": user.first_name, "last_name": user.last_name}
        )

    return Response({"birthdays": list(birthdays.values())}, status=status.HTTP_200_OK)
