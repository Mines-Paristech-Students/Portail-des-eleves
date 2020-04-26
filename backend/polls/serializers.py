from rest_framework import serializers

from authentication.models import User
from polls.models import Choice, Poll, Vote


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        read_only_fields = ("id", "number_of_votes")
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


class WritePollSerializerMixin(serializers.ModelSerializer):
    """Inherit from this class to get the update and create behaviours."""

    def update(self, instance, validated_data):
        if "choices" in validated_data:
            choices_data = validated_data.pop("choices")

            # Delete the old choices and create the new ones.
            instance.choices.all().delete()

            for choice_data in choices_data:
                Choice.objects.create(poll=instance, text=choice_data["text"])

        return super(WritePollSerializerMixin, self).update(instance, validated_data)

    def create(self, validated_data):
        choices_data = validated_data.pop("choices")

        # Create the new poll.
        poll = Poll.objects.create(**validated_data)

        # Create the new choices.
        for choice_data in choices_data:
            Choice.objects.create(poll=poll, text=choice_data["text"])

        return poll


class UserHasVotedPollSerializerMixin(serializers.ModelSerializer):
    """Inherit from this class to get the `user_has_voted` `SerializerMethodField`."""

    user_has_voted = serializers.SerializerMethodField()

    def get_user_has_voted(self, poll: Poll):
        request = self.context.get("request", None)
        user = getattr(request, "user", None)
        return user.id in poll.votes.all().values_list("user__id", flat=True)


class ReadOnlyPollSerializer(UserHasVotedPollSerializerMixin):
    """Give a read-only access to the polls, displaying the user if it is the current user."""

    choices = ChoiceSerializer(many=True, read_only=True)
    user = serializers.SerializerMethodField()

    class Meta:
        model = Poll
        read_only_fields = (
            "id",
            "publication_date",
            "state",
            "choices",
            "question",
            "has_been_published",
            "is_active",
            "user_has_voted",
            "user",
        )
        fields = read_only_fields

    def get_user(self, poll: Poll):
        request = self.context.get("request", None)
        user = getattr(request, "user", None)

        return user.id if poll.user == user else ""


class AuthorPollSerializer(WritePollSerializerMixin):
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


class AdminPollSerializer(WritePollSerializerMixin, UserHasVotedPollSerializerMixin):
    """An administrator can read and write every field, except the user field and the creation_date_time."""

    user = serializers.PrimaryKeyRelatedField(read_only=True)
    choices = ChoiceSerializer(many=True, read_only=False)

    class Meta:
        model = Poll
        read_only_fields = (
            "id",
            "user",
            "creation_date_time",
            "has_been_published",
            "is_active",
            "user_has_voted",
        )
        fields = read_only_fields + (
            "publication_date",
            "state",
            "choices",
            "question",
            "admin_comment",
        )
