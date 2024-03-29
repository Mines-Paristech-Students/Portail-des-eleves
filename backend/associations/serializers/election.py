from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from associations.models import Association, Election, Choice, Voter
from authentication.models import User
from authentication.serializers.user_short import UserShortSerializer


class VoteSerializer(serializers.Serializer):
    """This serializer is not bound to any model and is used for the /vote/ action."""

    choices = serializers.PrimaryKeyRelatedField(
        queryset=Choice.objects.all(), many=True, read_only=False
    )

    def save(self, **kwargs):
        raise NotImplementedError(
            "This serializer cannot be used for database operations."
        )


class VoterSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=False, read_only=False
    )

    class Meta:
        model = Voter
        read_only_fields = ("id",)
        fields = read_only_fields + ("user", "status", "election")

    def to_representation(self, voter: Voter):
        response = super(VoterSerializer, self).to_representation(voter)
        response["user"] = UserShortSerializer(voter.user).data
        return response


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        read_only_fields = ("id",)
        fields = read_only_fields + ("election", "name", "number_of_offline_votes")


class ElectionVoterSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=False, read_only=False
    )

    class Meta:
        model = Voter
        fields = ("user", "status")


class ElectionChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = (
            "id",
            "name",
            "number_of_offline_votes",
            "number_of_online_votes",
            "number_of_votes",
        )


class GetUserVoterMixin:
    def get_user_voter(self, election):
        try:
            return VoterSerializer(
                election.voters.get(user=self.context["request"].user)
            ).data
        except (Voter.DoesNotExist, Voter.MultipleObjectsReturned):
            return None


class ElectionSerializer(serializers.ModelSerializer, GetUserVoterMixin):
    association = serializers.PrimaryKeyRelatedField(
        queryset=Association.objects.all(), read_only=False
    )
    voters = ElectionVoterSerializer(many=True, read_only=False)
    choices = ElectionChoiceSerializer(many=True, read_only=False)
    user_voter = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Election

        read_only_fields = ("id",)
        fields = read_only_fields + (
            "association",
            "name",
            "starts_at",
            "ends_at",
            "results_are_published",
            "show_results",
            "max_choices_per_ballot",
            "choices",
            "voters",
            "user_voter",
        )

    def is_valid(self, raise_exception=False):
        """Check if the dates are consistent."""

        self._errors = {}

        if "starts_at" in self.initial_data and "ends_at" in self.initial_data:
            if self.initial_data["starts_at"] >= self.initial_data["ends_at"]:
                self._errors = {
                    "field_errors": "field starts_at is not consistent with field ends_at."
                }

        if self._errors and raise_exception:
            raise ValidationError(self._errors)

        return super(ElectionSerializer, self).is_valid(raise_exception)

    @classmethod
    def validate_against_instance(cls, instance, validated_data):
        # If the data is in validated_data, return it; otherwise, if the field is in instance, return it; otherwise,
        # return None.
        starts_at = validated_data.get(
            "starts_at", getattr(instance, "starts_at", None)
        )
        ends_at = validated_data.get("ends_at", getattr(instance, "ends_at", None))

        if starts_at and ends_at:
            if starts_at >= ends_at:
                raise ValidationError(
                    "field starts_at is not consistent with field ends_at."
                )

    def update(self, election, validated_data):
        self.validate_against_instance(election, validated_data)

        for field in ("association", "voters", "choices"):
            if field in validated_data:
                validated_data.pop(field)

        for field, value in validated_data.items():
            setattr(election, field, value)
        election.save()

        return election

    def create(self, validated_data):
        voters = validated_data.pop("voters")
        choices = validated_data.pop("choices")

        election = Election.objects.create(**validated_data)

        for voter in voters:
            Voter.objects.create(election=election, **voter)

        for choice in choices:
            Choice.objects.create(election=election, **choice)

        return election
