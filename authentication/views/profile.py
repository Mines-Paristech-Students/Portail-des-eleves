from django.http.response import HttpResponseForbidden

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from authentication.models import User
from authentication.permissions import ProfilePermission
from authentication.serializers.user import UpdateUserSerializer, UserSerializer, UserShortSerializer


class ProfileViewSetPagination(PageNumberPagination):
    page_query_parama = 'page'

    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 10


class ProfileViewSet(viewsets.ModelViewSet):
    """API endpoint that allows an user profile to be viewed or edited."""

    SIMPLE_USERS_EDITABLE_FIELDS = ['nickname',
                                    'phone',
                                    'room',
                                    'address',
                                    'city_of_origin',
                                    'option',
                                    'sports',
                                    'roommate',
                                    'minesparent', ]
    """The profile fields editable by a simple (non-admin) user."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [ProfilePermission]

    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('id', 'first_name', 'last_name')
    filter_fields = ('promo',)
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

    def get_serializer_class(self):
        if self.action in ('update', 'partial_update'):
            return UpdateUserSerializer
        elif self.action in ('list', ):
            return UserShortSerializer
        else:
            return UserSerializer

    def update(self, request, *args, **kwargs):
        """
            Can X update Y? \n
            X / Y       | Herself                               | Another user | \n
            Simple user | Only the SIMPLE_USERS_EDITABLE_FIELDS | No           | \n
            Admin       | Yes                                   | Yes          |
        """

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if not self.request.user.is_admin:
            # A simple user tries to edit another user.
            if instance.id != self.request.user.id:
                return HttpResponseForbidden('You are not allowed to edit this user.')

            # A simple user tries to edit a forbidden field in an another user.
            for field in serializer.validated_data:
                if field not in self.SIMPLE_USERS_EDITABLE_FIELDS:
                    return HttpResponseForbidden('You are not allowed to edit this user.')

        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
