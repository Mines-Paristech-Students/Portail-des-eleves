from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from forum.models import Theme, Topic, MessageForum
from forum.permissions import ThemePermission, TopicPermission, MessagePermission
from forum.serializers import ThemeSerializer, TopicSerializer, MessageForumSerializer


class ThemeViewSet(viewsets.ModelViewSet):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = (ThemePermission,)


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = (TopicPermission,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class MessageForumViewSet(viewsets.ModelViewSet):
    queryset = MessageForum.objects.all()
    serializer_class = MessageForumSerializer
    permission_classes = (MessagePermission,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=("put",), permission_classes=())
    def vote_up(self, *args, **kwargs):
        message = self.get_object()

        message.down_votes.remove(self.request.user)
        message.up_votes.add(self.request.user)
        return Response(status=status.HTTP_201_CREATED)

    @action(detail=True, methods=("put",), permission_classes=())
    def vote_down(self, *args, **kwargs):
        message = self.get_object()

        message.up_votes.remove(self.request.user)
        message.down_votes.add(self.request.user)
        return Response(status=status.HTTP_201_CREATED)
