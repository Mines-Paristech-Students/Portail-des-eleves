from django.forms import CharField
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework_jwt.serializers import User

from repartitions.models import Campaign, UserCampaign, Category, Wish, Group


class CampaignSerializer(serializers.ModelSerializer):
    manager = PrimaryKeyRelatedField(queryset=User.objects.all())
    status = CharField(max_length=100)

    class Meta:
        model = Campaign
        fields = ("id", "name", "manager", "status")

    def validate_status(self, status: str):
        if status not in Campaign.STATUS:
            raise serializers.ValidationError("Status is not valid")

        return status


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name")


class WishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wish
        fields = ("proposition", "rank")


class UserCampaignPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCampaign
        fields = ("user",)


class UserCampaignAdminSerializer(serializers.ModelSerializer):
    wishes = serializers.SerializerMethodField()

    def get_wishes(self, obj):
        return WishSerializer(many=True).to_representation(getattr(obj, "wishes", []))

    def to_representation(self, instance: UserCampaign):
        # we make category serialized in read but primary key in write
        res = super(UserCampaignAdminSerializer, self).to_representation(instance)
        res["category"] = CategorySerializer().to_representation(instance.category)

        return res

    class Meta:
        model = UserCampaign
        fields = ("user", "category", "fixed_to", "wishes")


class GroupAdminSerializer(serializers.ModelSerializer):
    users = UserCampaignAdminSerializer(many=True)

    class Meta:
        model = Group
        fields = ("users", "proposition", "campaign")


class GroupPublicSerializer(GroupAdminSerializer):
    users = UserCampaignPublicSerializer
