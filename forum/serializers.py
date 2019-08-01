from rest_framework import serializers

from forum.models import Theme, Topic, MessageForum
from authentication.serializers.user import UserShortSerializer

class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ("id", "name", "description", "is_hidden_1A")

class ThemeShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Theme
        fields = ("id", "name")

class TopicSerializer(serializers.ModelSerializer):
    creator = UserShortSerializer()
    theme = ThemeShortSerializer()

    class Meta:
        model = Topic
        fields = ("id", "name", "creator", "is_hidden_1A", "theme")

class TopicShortSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Topic
        fields = ("id","name")

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
        if 'request' not in self.context:
            return 0
        user = self.context['request'].user
        if obj.up_vote.filter(id = user.id).count() == 1:
            return 1
        elif obj.down_vote.filter(id = user.id).count() == 1:
            return -1
        else:
            return 0
