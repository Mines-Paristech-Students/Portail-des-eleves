import json
from rest_framework import permissions, viewsets
from rest_framework.views import APIView
from django.http import JsonResponse

from forum.models import Theme, Topic, MessageForum
from forum.serializers import ThemeSerializer, TopicSerializer, MessageForumSerializer


class ThemeViewSet(viewsets.ModelViewSet):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer

    def get_queryset(self):
        queryset = Theme.objects.all()

        user = self.request.user
        if(user is None or user.is_1A) :
            queryset = queryset.filter(is_hidden_1A = False)

        themeId = self.request.query_params.get('theme', None)
        if(themeId is not None):
            queryset = queryset.filter(theme = themeId)
        return queryset


class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_queryset(self):
        queryset = Topic.objects.all()

        user = self.request.user
        themeId = self.request.query_params.get('theme', None)
        if(user is None or user.is_1A) :
            queryset = queryset.filter(is_hidden_1A = False, theme__is_hidden_1A = False)

        if(themeId is not None):
            queryset = queryset.filter(theme = themeId)
        return queryset

    def create(self, request, **kwargs):

        body = json.loads(request.body)

        name = body["name"]
        is_hidden_1A = body["is_hidden_1A"]

        theme_id = body["theme"] if "theme" in body else None

        theme = Theme.objects.get(pk=theme_id)
        if theme is not None :
            user = request.user

            topic = Topic(
                name=name,
                creator=user,
                theme=theme,
                is_hidden_1A=is_hidden_1A
            )

            topic.save()

            return JsonResponse(TopicSerializer(topic).data, safe=False)

        else:
            return JsonResponse("No theme")

class MessageForumViewSet(viewsets.ModelViewSet):
    queryset = MessageForum.objects.all()
    serializer_class = MessageForumSerializer

    def get_queryset(self):
        queryset = MessageForum.objects.all()

        topicId = self.request.query_params.get('topic', None)
        user = self.request.user
        if(user is None or user.is_1A) :
            queryset = queryset.filter(topic__is_hidden_1A=False, topic__theme__is_hidden_1A=False)
        if(topicId is not None):
            queryset = queryset.filter(topic = topicId)
        return queryset

    def create(self, request, **kwargs):

        body = json.loads(request.body)

        text_message = body["message"]

        topic_id = body["topic"] if "topic" in body else None

        topic = Topic.objects.get(pk=topic_id)

        if topic is not None:
            user = request.user

            message = MessageForum(
                author=user,
                text=text_message,
                topic=topic
            )

            message.save()

            return JsonResponse(MessageForumSerializer(message).data, safe=False)

        else :
            return JsonResponse("No topic")

class NewVoteMessageView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        return JsonResponse({"status": "error", "message": "Can not see vote"}, status="405")

    def put(self, request, format=None):
        body = json.loads(request.body)
        user = request.user

        try:
            new_vote = int(body["new_vote"])
            message_id = int(body["message_id"])
            message = MessageForum.objects.get(pk=message_id)

            if message.up_vote.filter(id=user.id).count() != 0:
                message.up_vote.remove(user)
            if message.down_vote.filter(id=user.id).count() != 0:
                message.down_vote.remove(user)

            if new_vote == 1 :
                message.up_vote.add(user)
            elif new_vote == -1 :
                message.down_vote.add(user)

        except ValueError as err:
            return JsonResponse({"status": "error", "message": "Missing argument"}, status="400")

        return JsonResponse({"status": "ok"})