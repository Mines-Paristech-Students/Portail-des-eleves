from backend import settings

from rest_framework import generics, status
from rest_framework.response import Response

from associations.models.association import Association
from associations.serializers import AssociationsListSerializer
from authentication.views import JWTCookieAuthentication


class AssociationsListView(generics.ListCreateAPIView):
    """
    This class return an array of either all the associations or the number asked
    """
    is_prod_mode = settings.is_prod_mode()
    authentication_classes = [JWTCookieAuthentication]
    queryset = Association.objects.all()

    serializer_class = AssociationsListSerializer

    def get(self, request, number=0):
        # Add some tests if the user is a first year student

        queryset = list(self.queryset.values())

        if number != 0:
            queryset = queryset[:number]

        serializer = AssociationsListSerializer(data=queryset, many=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
