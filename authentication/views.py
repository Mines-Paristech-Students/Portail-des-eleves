from datetime import date, datetime, timedelta
from collections import defaultdict
import json

from django_filters.rest_framework import filters
from django.http import HttpResponse, JsonResponse
from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.response import Response

from authentication.authentication import JWTCookieAuthentication
from authentication.models import User
from authentication.serializers import TokenSerializer, UserSerializer, UserShortSerializer
from authentication.settings import api_settings
from authentication.utils import Birthday, BirthdaysEncoder
from backend import settings


class JWTSetCookiesView(generics.GenericAPIView):
    """
    This class gets creates a JWT token and sets it as a cookie
    """
    is_prod_mode = settings.is_prod_mode()
    serializer_class = TokenSerializer
    permission_classes = ()
    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        access_token = data['access']
        access_token_expiration = (datetime.now() + api_settings.ACCESS_TOKEN_LONG_LIFETIME)
        response = HttpResponse(status=status.HTTP_200_OK)
        response.set_cookie(
            api_settings.ACCESS_TOKEN_COOKIE_NAME,
            access_token,
            expires=access_token_expiration,
            httponly=True,
            secure=self.is_prod_mode,
        )
        return response


class LogoutView(generics.GenericAPIView):
    """
    This class removes the JWT token saved on the client browser
    """
    is_prod_mode = settings.is_prod_mode()

    def post(self, request, *args, **kwargs):
        """Overwrites the jwt cookie with a dummy value
        and makes it expire in the past so that most browser will
        delete the cookie
        """

        response = HttpResponse(status=status.HTTP_200_OK)
        response.set_cookie(
            api_settings.ACCESS_TOKEN_COOKIE_NAME,
            "deleted because you logged out",
            expires=datetime.fromtimestamp(0),
            httponly=True,
            secure=self.is_prod_mode,
        )
        return response


class CheckCredentials(generics.GenericAPIView):
    """
    This class gets both JWT tokens and sets them as secure cookies.
    """
    is_prod_mode = settings.is_prod_mode()
    authentication_classes = [JWTCookieAuthentication]

    def post(self, request, *args, **kwargs):
        return Response(
            {"id": request.user.id, "first_name": request.user.first_name, "last_name": request.user.last_name},
            status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    filter_backends = (SearchFilter,)
    search_fields = ('id', 'first_name')

    def get_object(self):
        """
        This method is called by the view set to retrieve
        data for a given user. The user identifier is in the pk kwargs.

        If pk is the string "current", we return the data for the current
        authenticated user.
        """
        pk = self.kwargs.get('pk')
        if pk == "current":
            return self.request.user

        return super(UserViewSet, self).get_object()

    def get_queryset(self):
        queryset = User.objects.all()
        starts_with = self.request.query_params.get('startswith', None)
        quantity = int(self.request.query_params.get('quantity', 10))
        if quantity > 10:
            raise ValidationError("You can't request for more than 10 elements")
        if starts_with is not None:
            queryset = queryset.filter(id__startswith=starts_with) | queryset.filter(first_name__startswith=starts_with) | queryset.filter(last_name__startswith=starts_with)
            queryset = queryset[:quantity]
        return queryset

    def get_serializer_class(self):
        if self.action == 'list' and self.request.query_params.get('startswith') is not None:
            return UserShortSerializer
        else:
            return UserSerializer

@api_view(['GET'])
def get_birthdays(request, days=7):
    """API endpoint to get birthdays information in the following X days
    """

    # Any request with more than 365 days basically mean to fetch all incoming birthdays over the year
    if days > 365:
        days = 365

    # Creating a month_idx list with all the month indexes (from 1 to 12) where we look for birthdays
    # If today is Sept. 25 and we want the next 7 days, month_idx will be [09, 10]
    # If today is in Sept. 25 and we want 364 days, month_idx will be [09, 10, 11, 12, 01, 02, 03, 04, 05, 06, 07, 08, 09]
    # 09 is twice in the array, this is important to look have birthdays from 25 Sept at the beginning and birthdays from 1 to 25 Sept at the end
    start = Birthday.from_date(date.today())
    end = Birthday.from_date(date.today() + timedelta(days=days-1))
    if start.month > end.month:
        month_idx = [i % 12 if i != 12 else 12 for i in range(start.month, end.month + 12 + 1)]
    elif start.month == end.month and start.day > end.day:
        month_idx = [i % 12 if i != 12 else 12 for i in range(start.month, end.month + 12 + 1)]
    else:
        month_idx = [i for i in range(start.month, end.month+1)]

    # Creating a list of User objects having their birthdays between start and end date
    users = []
    if len(month_idx) == 1:
        # Only one month, fetch birthdays between start and end
        users.extend(User.objects.all().filter(birthday__month=month_idx[0], birthday__day__gte=start.day, birthday__day__lte=end.day).order_by('birthday__day').all())
    elif len(month_idx) == 2:
        # Only two months, fetch birthdays from start in month 1 and from 1 to end in month 2
        users.extend(User.objects.all().filter(birthday__month=month_idx[0], birthday__day__gte=start.day).order_by('birthday__day').all())
        users.extend(User.objects.all().filter(birthday__month=month_idx[1], birthday__day__lte=end.day).order_by('birthday__day').all())
    else: # len(month_idx) > 2
        # More than two months, fetch birthdays from start in month 1, all birthdays from 1 to end in last month, and all birthdays in between
        users.extend(User.objects.all().filter(birthday__month=month_idx[0], birthday__day__gte=start.day).order_by('birthday__day').all())
        for i in range(1, len(month_idx) - 1):
            users.extend(User.objects.all().filter(birthday__month=month_idx[i]).order_by('birthday__day').all())
        users.extend(User.objects.all().filter(birthday__month=month_idx[-1], birthday__day__lte=end.day).order_by('birthday__day').all())

    # No more sql request from here
    # Here we just format the answer as a json dict
    # keys are Birthday objects (to have 1996-08-28 and 2000-08-28 on the same idx)
    # values are the list of the users having their birthday on the given date
    birthdays = {}
    for user in users:
        bd = Birthday.from_date(user.birthday)
        if bd not in birthdays:
            birthdays[bd] = []
        birthdays[bd].append({
            'id': user.id,
            'first_name':user.first_name,
            'last_name':user.last_name
        })

    # Using the BirthdaysEncoder class to make the last format step
    return HttpResponse(json.dumps(birthdays, cls=BirthdaysEncoder), status=status.HTTP_200_OK)


@api_view(["GET"])
def get_promotions(request):
    query = list(User.objects.order_by().values("promo").distinct())
    res = [e["promo"] for e in query]
    return JsonResponse({"promotions": res})
