from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter

from authentication.models import User
from authentication.serializers.user import UserSerializer, UserShortSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows user to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('id', 'first_name', 'last_name')
    filter_fields = ('promo',)

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
