from rest_framework import serializers

from authentication.models import User
from directory.models import DoctorOpinion


class DoctorOpinionSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    def get_user(self, doctor_opinion):
        if doctor_opinion.is_anonymous:
            return None
        return serializers.PrimaryKeyRelatedField(
            queryset=User.objects.all()
        ).to_representation(doctor_opinion.user)

    class Meta:
        model = DoctorOpinion
        fields = ("id", "user", "reason_for_consultation", "comment")
