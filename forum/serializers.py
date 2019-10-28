from rest_framework import serializers

from authentication.serializers.user import UserShortSerializer
from forum.models import Theme, Topic, MessageForum
from tags.serializers import filter_tags


class TopicShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Topic
        fields = ("id", "name")


class ThemeShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Theme
        fields = ("id", "name")


class MessageForumSerializer(serializers.ModelSerializer):
    author = UserShortSerializer()
    topic = TopicShortSerializer()
    ratio = serializers.SerializerMethodField(read_only=True)
    my_vote = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MessageForum
        fields = ("id", "author", "text", "date", "topic", "ratio", "my_vote")

    def get_ratio(self, obj):
        return obj.up_vote.count() - obj.down_vote.count()

    def get_my_vote(self, obj):
        if "request" not in self.context:
            return 0
        user = self.context["request"].user
        if obj.up_vote.filter(id=user.id).count() == 1:
            return 1
        elif obj.down_vote.filter(id=user.id).count() == 1:
            return -1
        else:
            return 0


class TopicSerializer(serializers.ModelSerializer):
    creator = UserShortSerializer()
    theme = ThemeShortSerializer()

    class Meta:
        model = Topic
        fields = ("id", "name", "creator", "theme")


class ThemeSerializer(serializers.ModelSerializer):
    topics = TopicShortSerializer(many=True)
    tags = serializers.SerializerMethodField()

    def get_tags(self, obj):
        return filter_tags(self.context, obj, short=False)

    class Meta:
        model = Theme
        read_only_fields = ("id", "topics", "tags")
        fields = read_only_fields + ("name", "description")
