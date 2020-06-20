from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.relations import PrimaryKeyRelatedField

from associations.models import Association, Library, Loanable, Loan
from associations.serializers.library_short import (
    LoanableShortSerializer,
    LoanPrioritySerializerMixin,
    LoanShortSerializer,
)
from associations.serializers.association_short import AssociationShortSerializer
from authentication.models import User
from tags.serializers import filter_tags, filter_nested_attribute


class CreateLoanSerializer(serializers.ModelSerializer):
    """Only serialize the loanable and the user."""

    loanable = PrimaryKeyRelatedField(queryset=Loanable.objects.all())
    user = PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Loan
        fields = ("loanable", "user")


class UpdateLoanSerializer(serializers.ModelSerializer):
    """Only serialize the status and the dates."""

    class Meta:
        model = Loan
        fields = ("status", "loan_date", "real_return_date", "expected_return_date")

    @classmethod
    def validate_date_order(cls, data, before_date_field_name, after_date_field_name):
        if data[before_date_field_name] >= data[after_date_field_name]:
            raise ValidationError(
                {
                    "field_errors": f"field {before_date_field_name} is not consistent with "
                    f"field {after_date_field_name}."
                }
            )

    @classmethod
    def validate_dates(cls, data):
        loan_date = data.get("loan_date", None)
        real_return_date = data.get("real_return_date", None)
        expected_return_date = data.get("expected_return_date", None)

        if loan_date and expected_return_date:
            cls.validate_date_order(data, "loan_date", "expected_return_date")
        if loan_date and real_return_date:
            cls.validate_date_order(data, "loan_date", "real_return_date")

    def is_valid(self, raise_exception=False):
        """Check the consistency of the provided dates against themselves, NOT against the updated object."""

        is_valid_super = super(UpdateLoanSerializer, self).is_valid(
            raise_exception=True
        )

        if is_valid_super:
            try:
                self.validate_dates(self.initial_data)
            except ValidationError as e:
                self._validated_data = {}
                self._errors = e.detail
            else:
                self._errors = {}

            if self._errors and raise_exception:
                raise ValidationError(self._errors)

        return is_valid_super and not bool(self._errors)


class LoanSerializer(LoanPrioritySerializerMixin, serializers.ModelSerializer):
    loanable = PrimaryKeyRelatedField(queryset=Loanable.objects.all())
    user = PrimaryKeyRelatedField(queryset=User.objects.all())

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

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)
        res["library"] = instance.loanable.library.id
        res["loanable"] = LoanableShortSerializer(self.context).to_representation(
            instance.loanable
        )
        return res


class LoanableSerializer(serializers.ModelSerializer):
    library = serializers.PrimaryKeyRelatedField(
        many=False, read_only=False, queryset=Library.objects
    )
    tags = serializers.SerializerMethodField()
    user_loan = serializers.SerializerMethodField()
    number_of_pending_loans = serializers.SerializerMethodField()

    class Meta:
        model = Loanable
        read_only_fields = ("id", "tags", "user_loan", "number_of_pending_loans")
        fields = read_only_fields + (
            "name",
            "description",
            "image",
            "comment",
            "library",
        )

    def get_tags(self, obj):
        return filter_tags(self.context, obj, short=False)

    def get_user_loan(self, loanable):
        """Return the last loan of the user for this loanable."""

        request = self.context.get("request", None)
        user = getattr(request, "user", None)

        user_loans = loanable.loans.order_by("-request_date").filter(user=user)

        if user_loans.exists():
            return LoanShortSerializer(context=self.context).to_representation(
                user_loans.first()
            )

        return None

    def get_number_of_pending_loans(self, loanable):
        """Return the number of pending loans for this loanable."""
        return loanable.number_of_pending_loans

    def to_representation(self, loanable: Loanable):
        res = super().to_representation(loanable)

        res["status"] = "AVAILABLE" if loanable.is_available() else "BORROWED"
        res["expected_return_date"] = loanable.get_expected_return_date()

        return res

    def update(self, instance, validated_data):
        if "library" in validated_data:
            validated_data.pop("library")
        return super(LoanableSerializer, self).update(instance, validated_data)


class LibrarySerializer(serializers.ModelSerializer):
    loanables = serializers.SerializerMethodField()

    class Meta:
        model = Library
        fields = ("id", "enabled", "association", "loanables")

    def get_loanables(self, obj):
        return filter_nested_attribute(
            self.context,
            obj,
            LoanableShortSerializer,
            "loanables",
            Q(tags__is_hidden=True),
        )

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)

        res["association"] = AssociationShortSerializer().to_representation(
            Association.objects.get(pk=res["association"])
        )
        return res

    def create(self, validated_data):
        raise NotImplementedError(
            "Please use `associations.serializers.library.LibraryWriteSerializer`."
        )

    def update(self, instance, validated_data):
        raise NotImplementedError(
            "Please use `associations.serializers.library.LibraryWriteSerializer`."
        )


class LibraryWriteSerializer(serializers.ModelSerializer):
    """We have to use two serializers, one for writing and the other for reading only, because a `SerializerMethodField`
    is a read-only field."""

    class Meta:
        model = Library
        fields = ("id", "enabled", "association", "loanables")

    def create(self, validated_data):
        """Create a new instance of Library based upon validated_data."""

        # A new Library is linked to an existing association.
        association_data = validated_data.pop("association")
        association = Association.objects.get(pk=association_data.id)

        # A new Library may come with new loanables.
        loanables_data = validated_data.pop("loanables")

        # Insert the Library first, then the loanables, because the newly created Library object is needed to create
        # the loanables.
        library = Library.objects.create(**validated_data)
        association.library = library
        association.save()

        # Insert the loanables.
        for loanable_data in loanables_data:
            Loanable.objects.create(
                name=loanable_data["name"],
                description=loanable_data.get("description", None),
                image=loanable_data.get("image", None),
                comment=loanable_data.get("comment", None),
                library=library,
            )

        return library

    def update(self, instance, validated_data):
        """
            Update an existing instance of Library based upon validated_data.\n
            The nested fields association and loanables will not be updated.
        """

        instance.enabled = validated_data.get("enabled", instance.enabled)
        instance.save()
        return instance
