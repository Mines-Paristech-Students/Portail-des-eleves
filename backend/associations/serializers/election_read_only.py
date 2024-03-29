from rest_framework import serializers

from associations.models import Choice, Voter, Election
from associations.serializers.election import VoterSerializer, GetUserVoterMixin


class ChoiceReadOnlySerializer(serializers.ModelSerializer):
    """Display the number_of_votes of each result if published."""

    class Meta:
        model = Choice
        read_only_fields = ("id", "name")
        fields = read_only_fields

    def to_representation(self, instance: Choice):
        response = super(ChoiceReadOnlySerializer, self).to_representation(instance)

        if instance.show_results:
            response["number_of_votes"] = instance.number_of_votes
            response["number_of_offline_votes"] = instance.number_of_offline_votes
            response["number_of_online_votes"] = instance.number_of_online_votes

        return response

    def save(self, **kwargs):
        raise NotImplementedError("This serializer is read-only.")


class ElectionReadOnlySerializer(serializers.ModelSerializer, GetUserVoterMixin):
    choices = ChoiceReadOnlySerializer(many=True, read_only=True)
    user_voter = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Election
        read_only_fields = (
            "id",
            "association",
            "name",
            "starts_at",
            "ends_at",
            "max_choices_per_ballot",
            "choices",
            "is_active",
            "show_results",
            "user_voter",
        )
        fields = read_only_fields

    def save(self, **kwargs):
        raise NotImplementedError("This serializer is read-only.")
