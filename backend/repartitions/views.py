import json

from django.http import HttpResponseBadRequest
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_extensions.mixins import NestedViewSetMixin

from repartitions.algorithm import make_reparition
from repartitions.models import Campaign, UserCampaign, Wish, Proposition, Group
from repartitions.permissions import (
    CanManageCampaign,
    user_in_campaign,
    UserCampaignPermission,
)
from repartitions.serializers import (
    CampaignSerializer,
    UserCampaignAdminSerializer,
    WishSerializer,
    GroupAdminSerializer,
    GroupPublicSerializer,
    UserCampaignPublicSerializer,
)


class CampaignView(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = (CanManageCampaign,)

    def create(self, request, *args, **kwargs):
        request.data["manager"] = request.user.id
        return super(CampaignView, self).create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        queryset = [
            c
            for c in queryset
            if user_in_campaign(request.user, c) or c.manager == request.user
        ]

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

        campaign = serializer.instance

        if campaign.status == "OPEN":
            Group.objects.filter(campaign=campaign).delete()
            serializer.is_valid(raise_exception=True)
            serializer.save()
        elif campaign.groups.count() == 0:
            make_reparition(campaign)


class UserCampaignView(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = UserCampaign.objects.all()
    permission_classes = (UserCampaignPermission,)

    def perform_create(self, serializer):
        campaign = Campaign.objects.get(pk=self.kwargs["parent_lookup_campaign"])
        serializer.save(campaign=campaign)

    def get_object(self):
        """ Override of parent `get_object` method but filters by default the user's repartitions """
        queryset = self.filter_queryset(self.get_queryset())

        # Perform the lookup filtering.
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
            "Expected view %s to be called with a URL keyword argument "
            'named "%s". Fix your URL conf, or set the `.lookup_field` '
            "attribute on the view correctly."
            % (self.__class__.__name__, lookup_url_kwarg)
        )

        filter_kwargs = {
            "user": self.kwargs["pk"],
            "campaign": self.kwargs["parent_lookup_campaign"],
        }
        obj = get_object_or_404(queryset, **filter_kwargs)

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj

    def get_serializer_class(self):
        if self.request.user.is_admin:
            return UserCampaignAdminSerializer
        else:
            return UserCampaignPublicSerializer


class WishesView(APIView):
    def get(self, request, *args, **kwargs):
        wishes = Wish.objects.filter(
            user_campaign__user=request.user,
            user_campaign__campaign=kwargs["campaign_id"],
        ).all()
        serializer = WishSerializer(many=True, instance=wishes)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        campaign = Campaign.objects.get(pk=kwargs["campaign_id"])

        if campaign.status != "OPEN":
            return Response("You cannot change you wishes now", status=403)

        propositions = Proposition.objects.filter(campaign=campaign).all()

        serializer = WishSerializer(many=True, data=request.data["wishes"])
        serializer.is_valid(raise_exception=True)
        wishes = serializer.data

        rank_used = {i + 1: 0 for i in range(len(propositions))}
        propositions_used = {proposition.id: 0 for proposition in propositions}

        for wish in wishes:
            if wish["rank"] in rank_used:
                rank_used[wish["rank"]] += 1

            if wish["rank"] in propositions_used:
                propositions_used[wish["proposition"]] += 1

        if not all(map(lambda x: x == 1, rank_used.values())):
            return HttpResponseBadRequest(
                {
                    "status": "error",
                    "message": "not all ranks were used",
                    "debug": rank_used,
                }
            )

        if not all(map(lambda x: x == 1, propositions_used.values())):
            return HttpResponseBadRequest(
                json.dumps(
                    {
                        "status": "error",
                        "message": "not all propositions were used",
                        "debug": propositions_used,
                    }
                )
            )

        Wish.objects.filter(
            user_campaign__campaign=campaign, user_campaign__user=request.user
        ).delete()

        serializer.save(
            user_campaign_id=UserCampaign.objects.filter(
                user=request.user, campaign_id=campaign
            )
            .first()
            .id
        )
        return Response({"status": "ok"}, status=status.HTTP_202_ACCEPTED)


@api_view(["GET"])
def get_campaign_results(request, *args, **kwargs):
    campaign = Campaign.objects.get(pk=kwargs["campaign_id"])
    if request.user != campaign.manager or campaign.status == "OPEN":
        raise PermissionDenied()

    serializer = GroupAdminSerializer(instance=campaign.groups.all(), many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_my_campaign_results(request, *args, **kwargs):
    campaign = Campaign.objects.get(pk=kwargs["campaign_id"])
    if campaign.status != "RESULTS":
        raise PermissionDenied()

    serializer = GroupPublicSerializer(instance=campaign.groups.all(), many=True)
    return Response(serializer.data)
