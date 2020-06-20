from rest_framework import serializers

from associations.models import Loanable, Library, Loan
from authentication.models import User
from tags.serializers import filter_tags


class LoanPrioritySerializerMixin(serializers.ModelSerializer):
    """Use this mixin to add a `priority` field to a `Loan` serializer."""

    priority = serializers.SerializerMethodField(read_only=True)

    def get_priority(self, loan):
        """If the status is `PENDING`, return the priority of this loan (if the loan is the first on the list,
        return 1).
        Otherwise, return `None`."""

        if loan.status == "PENDING":
            request = self.context.get("request", None)
            user = getattr(request, "user", None)
            pending_loans = loan.loanable.loans.filter(status="PENDING").order_by(
                "request_date"
            )

            for i, loan in enumerate(pending_loans, 1):
                if loan.user == user:
                    return i

        return None


class LoanShortSerializer(LoanPrioritySerializerMixin, serializers.ModelSerializer):
    loanable = serializers.PrimaryKeyRelatedField(queryset=Loanable.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Loan
        read_only_fields = ("id", "priority", "request_date")
        fields = read_only_fields + (
            "user",
            "status",
            "loanable",
            "expected_return_date",
            "loan_date",
            "real_return_date",
        )


class LoanableShortSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Loanable
        read_only_fields = ("tags",)
        fields = read_only_fields + ("name", "description", "image", "comment")

    def get_tags(self, obj):
        return filter_tags(self.context, obj, short=False)


class LibraryShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Library
        fields = ("id", "enabled", "association")
