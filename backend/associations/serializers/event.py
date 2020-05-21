from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from associations.models import Association, Event
from authentication.serializers import UserShortSerializer


class EventSerializer(serializers.ModelSerializer):
    association = serializers.PrimaryKeyRelatedField(
        queryset=Association.objects.all(), read_only=False
    )
    participants = UserShortSerializer(many=True, read_only=False)

    class Meta:
        model = Event
        read_only_fields = ("id",)
        fields = read_only_fields + (
            "association",
            "name",
            "description",
            "participants",
            "starts_at",
            "ends_at",
            "place",
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

        return super(EventSerializer, self).is_valid(raise_exception)

    def update(self, instance, validated_data):
        if "association" in validated_data:
            validated_data.pop("association")

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

        return super(EventSerializer, self).update(instance, validated_data)
