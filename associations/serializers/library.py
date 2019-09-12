from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.relations import PrimaryKeyRelatedField

from authentication.models import User
from associations.models import Association, Library, Loanable, Loan
from associations.serializers.association import AssociationsShortSerializer


def get_create_loan_serializer_class(request_user_param):
    """Give the class the request_user attribute."""

    class CreateLoanSerializer(serializers.ModelSerializer):
        """Only serialize the loanable and the user."""
        request_user = request_user_param

        loanable = PrimaryKeyRelatedField(queryset=Loanable.objects.all())
        user = PrimaryKeyRelatedField(queryset=User.objects.all())

        class Meta:
            model = Loan
            fields = ('loanable', 'user')

        def create(self, validated_data):
            """Check the consistency of the provided dates against the updated instance."""
            loanable = Loanable.objects.get(pk=validated_data['loanable'].id)

            if loanable.is_borrowed():
                raise ValidationError('The object is already borrowed.')

            user_role = self.request_user.get_role(loanable.library.association)
            user_is_library_admin = user_role is not None and user_role.library

            if not user_is_library_admin:
                if validated_data['user'].id != self.request_user.id:
                    raise ValidationError('Cannot create a Loan for another user.')

            instance = Loan.objects.create(**validated_data)
            return instance

    return CreateLoanSerializer


def get_update_loan_serializer_class(request_user_param):
    """Give the class the request_user attribute."""

    class UpdateLoanSerializer(serializers.ModelSerializer):
        """Only serialize the status and the dates."""
        request_user = request_user_param

        class Meta:
            model = Loan
            fields = ('status', 'loan_date', 'real_return_date', 'expected_return_date')

        @classmethod
        def validate_date_order(cls, data, before_date_field_name, after_date_field_name):
            if data[before_date_field_name] >= data[after_date_field_name]:
                raise ValidationError({'field_errors': f'field {before_date_field_name} is not consistent with '
                                                       f'field {after_date_field_name}.'})

        @classmethod
        def validate_date_consistency_against_themselves(cls, data):
            loan_date = data.get('loan_date', None)
            real_return_date = data.get('real_return_date', None)
            expected_return_date = data.get('expected_return_date', None)

            if loan_date and expected_return_date:
                cls.validate_date_order(data, 'loan_date', 'expected_return_date')
            if loan_date and real_return_date:
                cls.validate_date_order(data, 'loan_date', 'real_return_date')

        @classmethod
        def get_field_from_data_or_instance(cls, field, data, instance, default=None):
            """If the field is in data, return it; otherwise, if the field is in instance, return it; otherwise,
            return None."""
            return data.get(field, getattr(instance, field, default))

        @classmethod
        def validate_date_consistency_against_instance(cls, data, instance):
            loan_date = cls.get_field_from_data_or_instance('loan_date', data, instance)
            real_return_date = cls.get_field_from_data_or_instance('real_return_date', data, instance)
            expected_return_date = cls.get_field_from_data_or_instance('expected_return_date', data, instance)

            if loan_date and expected_return_date:
                if loan_date >= expected_return_date:
                    raise ValidationError('loan_date is not consistent with expected_return_date.')
            if loan_date and real_return_date:
                if loan_date >= real_return_date:
                    raise ValidationError('loan_date is not consistent with real_return_date.')

        @classmethod
        def validate_status_consistency_against_instance(cls, data, instance: Loan):
            user_role = cls.request_user.get_role(instance.loanable.library.association)
            user_is_library_admin = user_role is not None and user_role.library

            if not user_is_library_admin:
                # The user is not a library admin: she is only allowed to change the status of her loan from PENDING
                # to CANCELLED.
                if hasattr(data, 'status'):
                    if instance.status == 'PENDING' and data['status'] != 'CANCELLED':
                        raise ValidationError('status is not consistent.')
                    elif instance.status != 'PENDING' and instance.status != data['status']:
                        raise ValidationError('status is not consistent.')

        def is_valid(self, raise_exception=False):
            """Check the consistency of the provided dates against themselves, NOT against the updated object."""

            is_valid_super = super(UpdateLoanSerializer, self).is_valid(raise_exception=True)

            if is_valid_super:
                try:
                    self.validate_date_consistency_against_themselves(self.initial_data)
                except ValidationError as e:
                    self._validated_data = {}
                    self._errors = e.detail
                else:
                    self._errors = {}

                if self._errors and raise_exception:
                    raise ValidationError(self.errors)

            return is_valid_super and not bool(self._errors)

        def update(self, instance: Loan, validated_data):
            """Check the consistency of the provided dates against the updated instance."""
            self.validate_date_consistency_against_instance(validated_data, instance)
            self.validate_status_consistency_against_instance(validated_data, instance)

            instance.status = self.get_field_from_data_or_instance('status', validated_data, instance)
            instance.loan_date = self.get_field_from_data_or_instance('loan_date', validated_data, instance)
            instance.expected_return_date = self.get_field_from_data_or_instance('expected_return_date',
                                                                                 validated_data, instance)
            instance.real_return_date = self.get_field_from_data_or_instance('real_return_date',
                                                                             validated_data, instance)
            instance.save()
            return instance

    return UpdateLoanSerializer


class LoanSerializer(serializers.ModelSerializer):
    loanable = PrimaryKeyRelatedField(queryset=Loanable.objects.all())
    user = PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Loan
        fields = ("id", "user", "status", "loanable",
                  "expected_return_date", "loan_date", "real_return_date")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)
        res["library"] = instance.loanable.library.id
        res["loanable"] = LoanableSerializer().to_representation(instance.loanable)
        return res


class LoanableShortSerializer(serializers.ModelSerializer):
    """Used to serialize loanables inside a LibrarySerializer."""

    class Meta:
        model = Loanable
        fields = ('name', 'description', 'image', 'comment')


class LoanableSerializer(serializers.ModelSerializer):
    library = serializers.PrimaryKeyRelatedField(many=False, read_only=False, queryset=Library.objects)

    class Meta:
        model = Loanable
        fields = ("id", "name", "description", "image", "comment", "library")

    def to_representation(self, instance):
        res = super().to_representation(instance)

        status = "available"
        expected_return_date = None

        for loan in instance.loans.all():
            if loan.real_return_date is None:
                expected_return_date = loan.expected_return_date
                status = "borrowed"

        res["status"] = status
        res["expected_return_date"] = expected_return_date

        return res


class LibraryShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Library
        fields = ('id', 'enabled', "association")


class LibrarySerializer(serializers.ModelSerializer):
    loanables = LoanableShortSerializer(many=True)

    class Meta:
        model = Library
        fields = ("id", "enabled", "association", "loanables")

    def create(self, validated_data):
        """Create a new instance of Library based upon validated_data."""

        # A new Library is linked to an existing association.
        association_data = validated_data.pop('association')
        association = Association.objects.get(pk=association_data)

        # A new Library may come with new loanables.
        loanables_data = validated_data.pop('loanables')

        # Insert the Library first, then the loanables, because the newly created Library object is needed to create
        # the loanables.
        library = Library.objects.create(**validated_data)
        association.library = library
        association.save()

        # Insert the loanables.
        for loanable_data in loanables_data:
            Loanable.objects.create(name=loanable_data['name'],
                                    description=loanable_data.get('description', None),
                                    image=loanable_data.get('image', None),
                                    comment=loanable_data.get('comment', None),
                                    library=library)

        return library

    def update(self, instance, validated_data):
        """
            Update an existing instance of Library based upon validated_data.\n
            The nested fields association and loanables will not be updated.
        """

        instance.enabled = validated_data.get('enabled', instance.enabled)
        instance.save()
        return instance

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)

        res['association'] = AssociationsShortSerializer().to_representation(
            Association.objects.get(pk=res['association']))
        return res
