from rest_framework import serializers

from forum.models import Theme, Topic, MessageForum


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        read_only_fields = ("id",)
        fields = read_only_fields + ("name", "description")


class TopicSerializer(serializers.ModelSerializer):
    author = serializers.CurrentUserDefault()
    theme = serializers.PrimaryKeyRelatedField(
        queryset=Theme.objects.all(), read_only=False
    )

    class Meta:
        model = Topic
        read_only_fields = ("id", "author")
        fields = read_only_fields + ("name", "theme")

    def to_representation(self, topic):
        res = super(TopicSerializer, self).to_representation(topic)
        res["theme"] = ThemeSerializer().to_representation(topic.theme)
        return res

    def update(self, instance, validated_data):
        # The author field cannot be updated.
        if "author" in validated_data:
            validated_data.pop("author")

        return super(TopicSerializer, self).update(instance, validated_data)


class MessageForumSerializer(serializers.ModelSerializer):
    author = serializers.CurrentUserDefault()
    topic = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(), read_only=False
    )

    user_vote = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MessageForum
        read_only_fields = ("id", "created_at", "author")
        fields = read_only_fields + ("text", "topic", "user_vote")

    def to_representation(self, message):
        res = super(MessageForumSerializer, self).to_representation(message)
        res["nb_up_votes"] = message.nb_up_votes
        res["nb_down_votes"] = message.nb_down_votes
        return res

    def update(self, instance, validated_data):
        # The author and topic fields cannot be updated.
        if "author" in validated_data:
            validated_data.pop("author")

        if "topic" in validated_data:
            validated_data.pop("topic")

        return super(MessageForumSerializer, self).update(instance, validated_data)

    def get_user_vote(self, message):
        user = self.context["request"].user

        if message.up_votes.filter(id=user.id).exists():
            return 1
        elif message.down_votes.filter(id=user.id).exists():
            return -1
        else:
            return 0
