from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from chat.models import ChatMessage
from chat.serializers import ChatMessageSerializer


class ChatMessageViewSet(
    mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """
    API endpoint that allows chat messages to be viewed, inserted or edited.
    """

    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    def perform_create(self, serializer):
        """Overriden from mixins.CreateModelMixin
        The user field from the serializers is populated with the user doing the request.
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"])
    def retrieve_up_to(self, serializer):
        """Retrieves multiple chat messages. Url link is "http://......./chat/retrieve_up_to/?quantity=X&to=Y"

        quantity: Number of messages to retrieve (defauts to 10)
        to: Id of the last message to retrieve (excluded)

        A typical use case is to retrieve old messages either when loading the page or to load older messages.
        Make the call first without the 'to' parameter, then use the oldest message id to make a new query
        and retrieve messages more messages.
        """

        if self.queryset.first() is None:
            return Response(
                self.get_serializer(self.queryset.filter(id__lt=0)[:], many=True).data
            )

        params = self.request.query_params

        number_of_messages = int(params.get("quantity", 10))
        if number_of_messages > 200:
            raise ValidationError("Fetching more than 200 messages is not allowed")
        if "to" in params:
            to_id = int(params["to"])
        else:
            to_id = self.queryset.first().id + 1
        chat_messages = reversed(
            self.queryset.filter(id__lt=to_id)[:number_of_messages]
        )
        serializer = self.get_serializer(chat_messages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def retrieve_from(self, serializer):
        """Retrieves multiple chat messages. Url link is "http://......./chat/retrieve_from/?from=X"

        from: Id of the latest message known by the user.

        Once a first call is made to "retrieve_up_to" to retrieve the latest messages, the "retrieve_from" method is called regularly from the frontend,
        something like once every second. The from parameter is filled with the id of the latest message known by the user.
        It returns the list of newer messages (if any), it max out to 10."""

        params = self.request.query_params
        if "from" not in params:
            raise ValidationError("The 'from' parameter is required")
        from_param = params["from"]
        if not from_param.isdigit():
            raise ValidationError(
                "The 'from' parameter must be an int and not '%s'" % from_param
            )
        from_param = int(from_param)

        latest_message = self.queryset.first()
        if latest_message is None or from_param >= latest_message.id:
            # No newer message to return
            return Response()

        chat_messages = reversed(self.queryset.filter(id__gt=from_param)[:10])
        serializer = self.get_serializer(chat_messages, many=True)
        return Response(serializer.data)
