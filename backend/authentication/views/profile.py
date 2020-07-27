from django_filters.rest_framework import FilterSet, DjangoFilterBackend
from rest_framework import filters, viewsets

from authentication.models import User
from authentication.permissions import ProfilePermission
from authentication.serializers.user import (
    ReadOnlyUserSerializer,
    UpdateOnlyUserSerializer,
    UserShortSerializer,
)
from tags.filters import HasHiddenTagFilter


class ProfileFilter(FilterSet):
    class Meta:
        model = User
        fields = {"id": ["exact", "in"], "promotion": ["exact", "in"]}


class ProfileViewSet(viewsets.ModelViewSet):
    """
        API endpoint that allows an user profile to be viewed or edited.

        Parameters:
            - search: search in `id`, `first_name`, `last_name` fields.
            - promotion: does NOT follow the standard behaviour. Filter on the `promotion` field. Several promotions may be given, they must be separated by commas.
    """

    queryset = User.objects.all()
    serializer_class = ReadOnlyUserSerializer
    permission_classes = (ProfilePermission,)

    filterset_class = ProfileFilter
    filter_backends = (
        DjangoFilterBackend,
        filters.OrderingFilter,
        filters.SearchFilter,
        HasHiddenTagFilter,
    )  # SearchFilter is not enabled by default.
    search_fields = ("id", "first_name", "last_name", "option", "promotion")

    def get_serializer_class(self):
        if self.action in ("list",):
            return UserShortSerializer
        elif self.action in ("partial_update", "update"):
            return UpdateOnlyUserSerializer

        return ReadOnlyUserSerializer

    def get_object(self):
        """
        This method is called by the view set to retrieve data for a given user.
        The user identifier is in the pk kwargs.\n
        If pk is the string "current", return the data for the current authenticated user.
        """

        if self.kwargs["pk"] == "current":
            self.check_object_permissions(self.request, self.request.user)
            return self.request.user

        return super(ProfileViewSet, self).get_object()
