from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from associations.models import User, Election, Choice, Vote


class ChoiceSerializer(serializers.ModelSerializer):
    election = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Choice
        read_only_fields = ('id', 'election',)  # 'election' will be provided by the view.
        fields = read_only_fields + ('name',)


class VoteSerializer(serializers.ModelSerializer):
    election = serializers.PrimaryKeyRelatedField(read_only=True)
    choices = ChoiceSerializer(many=True, read_only=False)

    class Meta:
        model = Vote
        read_only_fields = ('id', 'election',)  # 'election' will be provided by the view.
        choices = read_only_fields + ('choices',)


class VoteShortSerializer(serializers.ModelSerializer):
    election = serializers.PrimaryKeyRelatedField(read_only=True)
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Vote
        read_only_fields = ('id', 'election', 'choices',)


class ElectionSerializer(serializers.ModelSerializer):
    """Read-only, restricted serializer for simple users."""

    association = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Election
        read_only_fields = ('id', 'association', 'name', 'starts_at', 'ends_at', 'max_choices_per_vote',)
        fields = read_only_fields


class ElectionAdminSerializer(serializers.ModelSerializer):
    association = serializers.PrimaryKeyRelatedField(read_only=True)
    registered_voters = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, read_only=False)
    choices = ChoiceSerializer(many=True, read_only=False)
    votes = VoteShortSerializer(many=True, read_only=True)

    class Meta:
        model = Election

        # Note: the 'voters' field is on purpose not included.
        read_only_fields = ('id', 'association',)
        fields = read_only_fields + ('name', 'choices', 'registered_voters', 'starts_at', 'ends_at',
                                     'max_choices_per_vote',)

    def is_valid(self, raise_exception=False):
        """Check if the dates are consistent."""

        self._errors = {}

        if 'starts_at' in self.initial_data and 'ends_at' in self.initial_data:
            if self.initial_data['starts_at'] >= self.initial_data['ends_at']:
                self._errors = {'field_errors': 'field starts_at is not consistent with field ends_at.'}

        if self._errors and raise_exception:
            raise ValidationError(self._errors)

        return super(ElectionAdminSerializer, self).is_valid(raise_exception)

    def update(self, instance, validated_data):
        # If the data is in validated_data, return it; otherwise, if the field is in instance, return it; otherwise,
        # return None.
        starts_at = validated_data.get('starts_at', getattr(instance, 'starts_at', None))
        ends_at = validated_data.get('ends_at', getattr(instance, 'ends_at', None))

        if starts_at and ends_at:
            if starts_at >= ends_at:
                raise ValidationError('field starts_at is not consistent with field ends_at.')

        return super(ElectionAdminSerializer, self).update(instance, validated_data)
