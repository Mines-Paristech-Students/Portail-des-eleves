from rest_framework import serializers

from associations.models import Library, Loanable


class LibraryShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Library
        fields = ('id', 'enabled', "association")


from associations.serializers.association import AssociationsShortSerializer


class LoanableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Loanable
        fields = ("id", "name", "description", "image")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)

        res["last_loan"] = instance.loans.order_by("loan_date").first()

        return res

class LibrarySerializer(serializers.ModelSerializer):
    association = AssociationsShortSerializer()
    loanables = LoanableSerializer(many=True)

    class Meta:
        model = Library
        fields = ("id", "enabled", "association", "loanables")
