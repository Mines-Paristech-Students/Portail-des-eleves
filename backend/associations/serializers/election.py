from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from associations.models import Association, Election, Choice, Ballot
from authentication.models import User


class ChoiceShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        read_only_fields = ("id", "name")
        fields = read_only_fields


class ChoiceSerializer(serializers.ModelSerializer):
    election = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Choice
        read_only_fields = (
            "id",
            "election",
        )  # 'election' will be provided by the user of the serializer.
        fields = read_only_fields + ("name",)


class BallotSerializer(serializers.ModelSerializer):
    election = serializers.PrimaryKeyRelatedField(read_only=True)
    choices = serializers.PrimaryKeyRelatedField(
        queryset=Choice.objects.all(), many=True, read_only=False
    )

    class Meta:
        model = Ballot
        read_only_fields = (
            "id",
            "election",
        )  # 'election' will be provided by the user of the serializer.
        fields = read_only_fields + ("choices",)


class BallotShortSerializer(serializers.ModelSerializer):
    election = serializers.PrimaryKeyRelatedField(read_only=True)
    choices = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Ballot
        read_only_fields = ("id", "election", "choices")
        fields = read_only_fields


class ElectionSerializer(serializers.ModelSerializer):
    """This serializer gives access to the registered_voters and choices fields.

    When updating two nested fields registered_voters and choices, the old content will be REPLACED by the new content.
      * registered_voters must be a list of User pk.
      * choices must be a list of dictionaries {'name': 'My Choice'}.
    """

    association = serializers.PrimaryKeyRelatedField(
        queryset=Association.objects.all(), read_only=False
    )
    registered_voters = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, read_only=False
    )
    choices = ChoiceSerializer(many=True, read_only=False)
    has_voted = serializers.SerializerMethodField(read_only=True)
    is_registered = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Election

        # The 'voters' and 'ballots' fields are on purpose not included.
        read_only_fields = ("id", "has_voted", "is_registered")
        fields = read_only_fields + (
            "association",
            "name",
            "choices",
            "registered_voters",
            "starts_at",
            "ends_at",
            "max_choices_per_ballot",
        )

    def get_has_voted(self, obj):
        idi = self.context["request"].user.id
        return (idi,) in obj.voters.values_list("id")

    def get_is_registered(self, obj):
        idi = self.context["request"].user.id
        return (idi,) in obj.registered_voters.values_list("id")

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

        if "association" in validated_data:
            validated_data.pop("association")

        if "registered_voters" in validated_data:
            # Replace the registered voters if provided.
            registered_voters = validated_data.pop("registered_voters")
            election.registered_voters.set(registered_voters)

        if "choices" in validated_data:
            new_choices_names = set([c["name"] for c in validated_data.pop("choices")])

            # Get all the old choices.
            old_choices_names = set(
                [c[0] for c in election.choices.values_list("name")]
            )

            # Remove the old choices not in the new choices.
            Choice.objects.filter(
                election=election, name__in=old_choices_names - new_choices_names
            ).delete()

            # Add the new choices not yet in the Choice table.
            Choice.objects.bulk_create(
                [
                    Choice(election=election, name=choice_name)
                    for choice_name in new_choices_names - old_choices_names
                ]
            )

        for field, value in validated_data.items():
            setattr(election, field, value)
        election.save()

        return election

    def create(self, validated_data):
        registered_voters = validated_data.pop("registered_voters")
        print("!!!!!!!!!!!!!!!!!!!!")
        print("coucou, on est dans create")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!")

        print(validated_data)
        choices = validated_data.pop("choices")

        election = Election.objects.create(**validated_data)

        election.registered_voters.set(registered_voters)

        for choice in choices:
            Choice.objects.create(election=election, **choice)

        return election
