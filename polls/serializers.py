from rest_framework import serializers

from authentication.models import User
from polls.models import Choice, Poll, Vote


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        read_only_fields = ("id",)
        fields = read_only_fields + ("text",)

    def save(self, poll, **kwargs):
        super(ChoiceSerializer, self).save(poll=poll, **kwargs)


class VoteSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=serializers.CurrentUserDefault()
    )
    choice = serializers.PrimaryKeyRelatedField(
        queryset=Choice.objects.all(), read_only=False
    )

    class Meta:
        model = Vote
        read_only_fields = ("user",)
        fields = read_only_fields + ("choice",)


class ReadOnlyPollSerializer(serializers.ModelSerializer):
    """Only give a read-only access to the question and the choices."""

    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Poll
        read_only_fields = ("id", "choices", "question")
        fields = read_only_fields


class WritePollSerializer(serializers.ModelSerializer):
    """This class allow AuthorPollSerializer and AdminPollSerializer to share update and create behaviours."""

    def update(self, instance, validated_data):
        if "choices" in validated_data:
            choices_data = validated_data.pop("choices")

            # Delete the old choices and create the new ones.
            instance.choices.all().delete()

            for choice_data in choices_data:
                Choice.objects.create(poll=instance, text=choice_data["text"])

        return super(WritePollSerializer, self).update(instance, validated_data)

    def create(self, validated_data):
        choices_data = validated_data.pop("choices")

        # Create the new poll.
        poll = Poll.objects.create(**validated_data)

        # Create the new choices.
        for choice_data in choices_data:
            Choice.objects.create(poll=poll, text=choice_data["text"])

        return poll


class AuthorPollSerializer(WritePollSerializer):
    """The serializer used when posting a Poll and for retrieving a poll as its author.
    Only the question and the choices are writable, all the data is readable.
    The user field is always set to the current user.
    """

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    choices = ChoiceSerializer(many=True, read_only=False)

    class Meta:
        model = Poll
        read_only_fields = (
            "id",
            "user",
            "creation_date_time",
            "state",
            "publication_date",
            "admin_comment",
        )
        fields = read_only_fields + ("question", "choices")


class AdminPollSerializer(WritePollSerializer):
    """An administrator can read and write every field, except the user field and the creation_date_time."""

    user = serializers.PrimaryKeyRelatedField(read_only=True)
    choices = ChoiceSerializer(many=True, read_only=False)

    class Meta:
        model = Poll
        read_only_fields = ("id", "user", "creation_date_time")
        fields = read_only_fields + (
            "question",
            "state",
            "publication_date",
            "admin_comment",
            "choices",
        )
