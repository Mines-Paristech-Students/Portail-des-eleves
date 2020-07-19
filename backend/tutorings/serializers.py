from rest_framework import serializers

from authentication.models import User
from tutorings.models import Tutoring, TutorApplication


class WriteTutoringSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutoring
        read_only_fields = ("id", "publication_date")
        fields = read_only_fields + ("name", "contact", "place", "subject", "level",
                                     "time_availability", "frequency", "description",)


class AdminTutoringSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutoring
        read_only_fields = ("id", "publication_date", "applications")
        fields = read_only_fields + ("name", "contact", "place", "subject", "level",
                                     "time_availability", "frequency", "description", "state","user","admin_comment")


class ReadOnlyTutoringSerializer(serializers.ModelSerializer):
    """Only give a read-only access to the tutorings."""

    applications = serializers.PrimaryKeyRelatedField(
        queryset=TutorApplication.objects.all(), write_only=True
    )

    class Meta:
        model = Tutoring
        read_only_fields = ("id", "place", "subject", "level", "time_availability", "frequency", "description",)
        fields = read_only_fields + ("applications",)


class ApplyTutorSerializer(serializers.ModelSerializer):
    """Serializer used for applying to tutorings position"""
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = TutorApplication
        read_only_fields = ("user", "tutoring")
        fields = read_only_fields


class AdminApplyTutorSerializer(serializers.ModelSerializer):
    """Serializer used for assigning tutorings position"""

    class Meta:
        model = TutorApplication
        read_only_fields = ("id", "paps_time", "user", "tutoring")
        fields = read_only_fields + ("state",)
