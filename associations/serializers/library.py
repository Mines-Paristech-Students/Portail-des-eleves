from rest_framework import serializers

from associations.models import Library, Loanable, Loan


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

        status = "available"
        expected_return_date = None

        for loan in instance.loans.all():
            if loan.real_return_date is None:
                expected_return_date = loan.expected_return_date
                status = "borrowed"

        res["status"] = status
        res["expected_return_date"] = expected_return_date

        return res


class LoanSerializer(serializers.ModelSerializer):
    loanable = LoanableSerializer()

    class Meta:
        model = Loan
        fields = ("id", "user", "status", "loanable",
                  "expected_return_date", "loan_date", "real_return_date")


class LibrarySerializer(serializers.ModelSerializer):
    association = AssociationsShortSerializer()
    loanables = LoanableSerializer(many=True)

    class Meta:
        model = Library
        fields = ("id", "enabled", "association", "loanables")
