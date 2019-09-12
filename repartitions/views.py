from rest_framework import viewsets, status
from rest_framework.response import Response

from repartitions.models import Campaign
from repartitions.permissions import CanManageCampaign, user_in_campaign
from repartitions.serializers import CampaignSerializer


class CampaignView(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = (CanManageCampaign, )

    def create(self, request, *args, **kwargs):
        request.data["manager"] = request.user.id
        return super(CampaignView, self).create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        queryset = [c for c in queryset if user_in_campaign(request.user, c) or c.manager == request.user]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
