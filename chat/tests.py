from rest_framework.test import APITestCase

from authentication.models import User
from chat.models import ChatMessage

class ChatTestCase(APITestCase):
    """
    Test the chat endpoints.
    """

    NUMBER_OF_MESSAGES = 30

    @classmethod
    def setUpClass(cls):
        cls.user = User.objects.create_user(
            '15veaux', 'Florian', 'Veaux', 'florian.veaux@mines-paristech.fr',
            'password', '1996-08-28', 15
        )
        for i in range(0, cls.NUMBER_OF_MESSAGES):
            ChatMessage.objects.create(
                user_id='15veaux',
                message='This is message #%d' % i
            )
        super(ChatTestCase, cls).setUpClass()

    def setUp(self):
        self.client.force_authenticate(self.user)

    def test_retrieve_up_to_latest(self):
        quantity = 10
        url = "/api/v1/chat/retrieve_up_to/?quantity=%d" % quantity
        response = self.client.get(url, format='json').data
        self.assertEqual(len(response), quantity)
        for i in range(0, quantity):
            message = response[i]
            self.assertEqual(message['id'], self.NUMBER_OF_MESSAGES - quantity + 1 + i)

    def test_retrieve_up_to(self):
        quantity = 10
        to = self.NUMBER_OF_MESSAGES - 1
        url = "/api/v1/chat/retrieve_up_to/?quantity=%d&to=%d" % (quantity, to)
        response = self.client.get(url, format='json').data
        self.assertEqual(len(response), quantity)
        for i in range(0, quantity):
            message = response[i]
            self.assertEqual(message['id'], to - quantity + i)

    def test_retrieve_from(self):
        expected_quantity = 6
        from_param = self.NUMBER_OF_MESSAGES - expected_quantity
        url = "/api/v1/chat/retrieve_from/?from=%d" % from_param
        response = self.client.get(url, format='json').data
        self.assertEqual(len(response), expected_quantity)
        for i in range(0, expected_quantity):
            message = response[i]
            self.assertEqual(message['id'], from_param + 1 + i)
