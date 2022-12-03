from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets
from rest_framework.filters import SearchFilter, OrderingFilter

from directory.models import Doctor
from directory.serializers.doctor import DoctorShortSerializer, DoctorSerializer
from tags.filters import HasHiddenTagFilter
from tags.filters.taggable import TaggableFilter


class DoctorFilter(TaggableFilter):
    class Meta:
        model = Doctor
        exclude = ()


class DoctorViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    queryset = Doctor.objects.all()
    filter_class = DoctorFilter
    filter_backends = (
        DjangoFilterBackend,
        SearchFilter,
        HasHiddenTagFilter,
        OrderingFilter,
    )
    search_fields = ("name", "address")
    ordering_fields = ("name", "address")

    def get_serializer_class(self):
        if self.action in ("list",):
            return DoctorShortSerializer
        return DoctorSerializer
