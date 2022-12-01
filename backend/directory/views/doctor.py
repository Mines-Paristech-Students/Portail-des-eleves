from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets
from rest_framework.filters import SearchFilter

from directory.models import Doctor
from directory.serializers.doctor import DoctorSerializer
from tags.filters import HasHiddenTagFilter
from tags.filters.taggable import TaggableFilter


class DoctorFilter(TaggableFilter):
    class Meta:
        model = Doctor
        exclude = ()


class DoctorViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Doctor.objects.all()
    filter_class = DoctorFilter
    filter_backends = (DjangoFilterBackend, SearchFilter, HasHiddenTagFilter)
    search_fields = ("name", "address")

    def get_serializer_class(self):
        return DoctorSerializer
