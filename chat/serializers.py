from rest_framework import serializers

from chat.models import ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):

    # This field is autopopulated with the current user id.
    user = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ('id', 'user', 'message', 'created_at')