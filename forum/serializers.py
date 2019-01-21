from rest_framework import serializers

from forum.models import Theme, Topic, MessageForum
from authentication.serializers import UserShortSerializer

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

    class Meta:
        model = MessageForum
        fields = ("id", "author", "text", "date", "topic")