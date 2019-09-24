from django.http.response import HttpResponseForbidden

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from authentication.models import User
from authentication.permissions import ProfilePermission
from authentication.serializers.user import UserSerializer, UserShortSerializer


class ProfileViewSetPagination(PageNumberPagination):
    page_query_param = 'page'

    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10


class ProfileViewSet(viewsets.ModelViewSet):
    """API endpoint that allows an user profile to be viewed or edited."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (ProfilePermission,)

    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('id', 'first_name', 'last_name')
    filter_fields = ('year_of_entry',)
    pagination_class = ProfileViewSetPagination

    def get_object(self):
        """
        This method is called by the view set to retrieve data for a given user.
        The user identifier is in the pk kwargs.\n
        If pk is the string "current", return the data for the current authenticated user.
        """

        if self.kwargs['pk'] == 'current':
            self.check_object_permissions(self.request, self.request.user)
            return self.request.user

        return super(ProfileViewSet, self).get_object()
