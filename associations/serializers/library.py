from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from associations.models import Association, Library, Loanable, Loan
from associations.serializers.association import AssociationsShortSerializer


class LibraryShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Library
        fields = ('id', 'enabled', "association")


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


class LoanSerializer(serializers.ModelSerializer):
    loanable = PrimaryKeyRelatedField(queryset=Loanable.objects.all())

    class Meta:
        model = Loan
        fields = ("id", "user", "status", "loanable",
                  "expected_return_date", "loan_date", "real_return_date")

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)
        res["library"] = instance.loanable.library.id
        res["loanable"] = LoanableSerializer().to_representation(instance.loanable)
        return res


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

    def to_representation(self, instance):
        res = super(serializers.ModelSerializer, self).to_representation(instance)

        res['association'] = AssociationsShortSerializer().to_representation(
            Association.objects.get(pk=res['association']))
        return res
