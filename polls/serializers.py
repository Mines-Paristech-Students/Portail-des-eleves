from rest_framework import serializers

from .models import Choice, Poll


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = (
            'text',
            'poll',
        )


class RestrictedChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ('text',)


class WholePollSerializer(serializers.HyperlinkedModelSerializer):
    """
    Serialize all the fields in the poll.
    Contains sensitive information, such as the user, the admin_comment..., so only the author and admin should
    have access to it.
    """
    choices = ChoiceSerializer(many=True, read_only=True)
    user = serializers.HyperlinkedRelatedField(view_name='user-detail', read_only=True)

    class Meta:
        model = Poll
        fields = '__all__'

        extra_kwargs = {
            'url': {'view_name': 'polls-retrieve', 'lookup_field': 'id'},
        }


class RestrictedPollSerializer(serializers.HyperlinkedModelSerializer):
    """Only serialize the url, the choices and the question."""
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Poll
        fields = ('url', 'choices', 'question')

        extra_kwargs = {
            'url': {'view_name': 'polls-retrieve', 'lookup_field': 'id'},
        }


class UpdatePollSerializer(serializers.ModelSerializer):
    """
    An admin updating a poll should only be able to edit its choices, its question, its state its
    publication datetimes, and the admin comment.
    """

    class Meta:
        model = Poll
        fields = (
            'question',
            'choices',
            'state',
            'publication_date_time',
            'publication_end_date_time',
            'admin_comment',
        )

    choices = RestrictedChoiceSerializer(many=True)

    def update(self, poll, validated_data):
        # Split the validated data between choices_data and poll_data
        choices_data = validated_data.pop('choices', None)
        poll_data = validated_data

        # Set each attribute on the Poll, and then save it.
        for attr, value in poll_data.items():
            poll.__setattr__(attr, value)
        poll.save()

        # If choices should be updated, delete the old choices and create the new ones.
        if choices_data is not None:
            poll.choices.all().delete()

            new_choices_text = {choice['text'] for choice in choices_data}
            for choice_text in new_choices_text:
                Choice.objects.create(poll=poll, text=choice_text)

        return poll


class SubmitPollSerializer(serializers.ModelSerializer):
    """An user submitting a poll should only submit its question and its choices."""

    class Meta:
        model = Poll
        fields = (
            'question',
            'choices',
        )

    choices = RestrictedChoiceSerializer(many=True)

    def create(self, validated_data):
        # Split the validated data between choices_data and poll_data
        choices_data = validated_data.pop('choices')
        poll_data = validated_data

        # Create the new poll
        poll = Poll.objects.create(**poll_data)
        poll.user = self.context['request'].user
        poll.save()

        # Create the new choices
        for choice_data in choices_data:
            Choice.objects.create(poll=poll, **choice_data)

        return poll
