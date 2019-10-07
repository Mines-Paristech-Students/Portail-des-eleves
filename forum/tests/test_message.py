from datetime import date, datetime, timezone

from backend.tests_utils import WeakAuthenticationBaseTestCase
from forum.models import MessageForum


class MessageTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_forum.yaml"]

    ALL_USERS = ["17admin", "17simple"]
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return "/forum/messages/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/forum/messages/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/forum/messages/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format, content_type)

    def endpoint_update(self, pk):
        return f"/forum/messages/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_destroy(self, pk):
        return f"/forum/messages/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)

    def endpoint_vote_up(self, pk):
        return f"/forum/messages/{pk}/vote_up/"

    def vote_up(self, pk, data=None, format="json", content_type="application/json"):
        return self.put(self.endpoint_vote_up(pk), data, format, content_type)

    def endpoint_vote_down(self, pk):
        return f"/forum/messages/{pk}/vote_down/"

    def vote_down(self, pk, data=None, format="json", content_type="application/json"):
        return self.put(self.endpoint_vote_down(pk), data, format, content_type)

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_messages(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_messages(self):
        self.login("17simple")
        res = self.list()
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_message(self):
        res = self.retrieve(pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_message(self):
        self.login("17simple")
        res = self.retrieve(pk=1)
        self.assertStatusCode(res, 200)

    def test_if_message_does_not_exist_then_404(self):
        self.login("17simple")
        res = self.retrieve(pk=42)
        self.assertFalse(MessageForum.objects.filter(pk="42").exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    create_message_valid_data = {"text": "Python est-il scalable ?", "topic": 1}

    def test_can_create_message(self):
        for user in self.ALL_USERS:
            self.login(user)

            res = self.create(self.create_message_valid_data)
            self.assertStatusCode(res, 201)

            last_message = MessageForum.objects.last()
            self.assertEqual(last_message.author.pk, user)
            self.assertEqual(last_message.text, self.create_message_valid_data["text"])

            now = datetime.now(tz=timezone.utc)
            self.assertTupleEqual(
                (
                    last_message.created_at.year,
                    last_message.created_at.month,
                    last_message.created_at.day,
                    last_message.created_at.hour,
                    last_message.created_at.minute,
                ),
                (now.year, now.month, now.day, now.hour, now.minute),
            )
            self.assertEqual(last_message.number_of_up_votes, 0)
            self.assertEqual(last_message.number_of_down_votes, 0)
            self.assertEqual(
                last_message.topic.pk, self.create_message_valid_data["topic"]
            )

    create_message_invalid_data_topic = {
        "text": "Python est-il scalable ?",
        "topic": 42,
    }

    def test_if_topic_does_not_exist_then_cannot_create_message(self):
        for user in self.ALL_USERS:
            self.login(user)

            length_before = MessageForum.objects.count()
            res = self.create(self.create_message_invalid_data_topic)
            self.assertStatusCode(res, 400)
            self.assertEqual(MessageForum.objects.count(), length_before)

    create_message_invalid_data_author = {
        "text": "Python est-il scalable ?",
        "topic": 1,
        "author": "17bocquet",
    }

    def test_cannot_create_message_for_another_user(self):
        for user in self.ALL_USERS:
            self.login(user)

            res = self.create(self.create_message_invalid_data_author)
            self.assertStatusCode(res, 201)
            last_message = MessageForum.objects.last()
            # The message was created, but the author is the current user.
            self.assertEqual(last_message.author.pk, user)
            self.assertEqual(last_message.text, self.create_message_valid_data["text"])

            now = datetime.now(tz=timezone.utc)
            self.assertTupleEqual(
                (
                    last_message.created_at.year,
                    last_message.created_at.month,
                    last_message.created_at.day,
                    last_message.created_at.hour,
                    last_message.created_at.minute,
                ),
                (now.year, now.month, now.day, now.hour, now.minute),
            )
            self.assertEqual(last_message.number_of_up_votes, 0)
            self.assertEqual(last_message.number_of_down_votes, 0)
            self.assertEqual(
                last_message.topic.pk, self.create_message_valid_data["topic"]
            )

    create_message_invalid_data_date = {
        "text": "Python est-il scalable ?",
        "topic": 1,
        "created_at": datetime(2018, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
    }

    def test_cannot_set_date(self):
        for user in self.ALL_USERS:
            self.login(user)

            res = self.create(self.create_message_invalid_data_author)
            self.assertStatusCode(res, 201)
            last_message = MessageForum.objects.last()
            self.assertEqual(last_message.author.pk, user)
            self.assertEqual(last_message.text, self.create_message_valid_data["text"])

            # The message was created, but the date is the current date.
            now = datetime.now(tz=timezone.utc)
            self.assertTupleEqual(
                (
                    last_message.created_at.year,
                    last_message.created_at.month,
                    last_message.created_at.day,
                    last_message.created_at.hour,
                    last_message.created_at.minute,
                ),
                (now.year, now.month, now.day, now.hour, now.minute),
            )
            self.assertEqual(last_message.number_of_up_votes, 0)
            self.assertEqual(last_message.number_of_down_votes, 0)
            self.assertEqual(
                last_message.topic.pk, self.create_message_valid_data["topic"]
            )

    ##########
    # UPDATE #
    ##########

    update_message_valid_data = {"text": "Je fais des tests et c’est ma joie."}

    def test_if_global_admin_then_can_update_messages(self):
        self.login("17admin")

        for message in MessageForum.objects.all():
            res = self.update(pk=message.pk, data=self.update_message_valid_data)
            self.assertStatusCode(res, 200)
            self.assertEqual(
                self.update_message_valid_data["text"],
                MessageForum.objects.get(pk=message.pk).text,
            )

    def test_if_author_then_can_update_messages(self):
        user = "17bocquet"
        self.login(user)

        q = MessageForum.objects.filter(author=user)
        self.assertGreater(q.count(), 0)

        for message in q:
            res = self.update(pk=message.pk, data=self.update_message_valid_data)
            self.assertStatusCode(res, 200)
            self.assertEqual(
                self.update_message_valid_data["text"],
                MessageForum.objects.get(pk=message.pk).text,
            )

    def test_if_not_author_then_cannot_update_messages(self):
        user = "17simple"
        self.login(user)

        q = MessageForum.objects.exclude(author=user)
        self.assertGreater(q.count(), 0)

        for message in q:
            res = self.update(pk=message.pk, data=self.update_message_valid_data)
            self.assertStatusCode(res, 403)
            self.assertNotEqual(
                self.update_message_valid_data["text"],
                MessageForum.objects.get(pk=message.pk).text,
            )

    update_message_invalid_data_author = {
        "text": "Je fais des tests et c’est ma joie.",
        "author": "17simple",
    }

    def test_cannot_update_author(self):
        self.login("17admin")

        old_message = MessageForum.objects.get(pk=1)
        res = self.update(pk=1, data=self.update_message_invalid_data_author)
        self.assertStatusCode(res, 200)

        # The text is updated, but the author does not change.
        message = MessageForum.objects.get(pk=1)
        self.assertEqual(self.update_message_invalid_data_author["text"], message.text)
        self.assertEqual(message.author, old_message.author)

    update_message_invalid_data_date = {
        "text": "Je fais des tests et c’est ma joie.",
        "created_at": datetime(2019, 1, 1, 0, 0, 0, tzinfo=timezone.utc),
    }

    def test_cannot_update_created_at(self):
        self.login("17admin")

        old_message = MessageForum.objects.get(pk=1)
        res = self.update(pk=1, data=self.update_message_invalid_data_author)
        self.assertStatusCode(res, 200)

        # The text is updated, but the date does not change.
        message = MessageForum.objects.get(pk=1)
        self.assertEqual(self.update_message_invalid_data_author["text"], message.text)
        self.assertEqual(message.created_at, old_message.created_at)

    update_message_invalid_data_topic = {
        "text": "Je fais des tests et c’est ma joie.",
        "topic": 2,
    }

    def test_cannot_update_topic(self):
        self.login("17admin")

        # The text is updated, but the topic does not change.
        res = self.update(pk=1, data=self.update_message_invalid_data_topic)
        self.assertStatusCode(res, 200)
        message = MessageForum.objects.get(pk=1)
        self.assertEqual(self.update_message_invalid_data_topic["text"], message.text)
        self.assertNotEqual(
            message.topic, self.update_message_invalid_data_topic["topic"]
        )

    ###########
    # DESTROY #
    ###########

    def test_if_global_admin_then_can_destroy_messages(self):
        self.login("17admin")

        for message in MessageForum.objects.all():
            res = self.destroy(pk=message.pk)
            self.assertStatusCode(res, 204)
            self.assertFalse(MessageForum.objects.filter(pk=message.pk).exists())

    def test_if_author_then_can_destroy_messages(self):
        user = "17bocquet"
        self.login(user)

        q = MessageForum.objects.filter(author=user)
        self.assertGreater(q.count(), 0)

        for message in q:
            res = self.destroy(pk=message.pk)
            self.assertStatusCode(res, 204)
            self.assertFalse(MessageForum.objects.filter(pk=message.pk).exists())

    def test_if_not_author_then_cannot_destroy_messages(self):
        user = "17simple"
        self.login(user)

        q = MessageForum.objects.exclude(author=user)
        self.assertGreater(q.count(), 0)

        for message in q:
            res = self.destroy(pk=message.pk)
            self.assertStatusCode(res, 403)
            self.assertTrue(MessageForum.objects.filter(pk=message.pk).exists())

    ########
    # VOTE #
    ########

    def test_can_vote(self):
        for user in self.ALL_USERS:
            self.login(user)

            for message in MessageForum.objects.all():
                res = self.vote_up(message.pk)
                self.assertStatusCode(res, 201)
                self.assertIn(
                    user,
                    [
                        x[0]
                        for x in MessageForum.objects.get(
                            pk=message.pk
                        ).up_votes.values_list("id")
                    ],
                )

                res = self.vote_down(message.pk)
                self.assertStatusCode(res, 201)
                self.assertIn(
                    user,
                    [
                        x[0]
                        for x in MessageForum.objects.get(
                            pk=message.pk
                        ).down_votes.values_list("id")
                    ],
                )

    ##################
    # BUSINESS LOGIC #
    ##################
    def test_business_logic(self):
        def check_results(pk, nb_up, nb_down):
            self.login("17simple")

            message = MessageForum.objects.get(pk=pk)
            self.assertEqual(message.number_of_up_votes, nb_up)
            self.assertEqual(message.number_of_down_votes, nb_down)

            res = self.retrieve(pk)
            self.assertStatusCode(res, 200)
            self.assertEqual(res.data["number_of_up_votes"], nb_up)
            self.assertEqual(res.data["number_of_down_votes"], nb_down)

        # Create a message.
        self.login("17simple")
        res = self.create(self.create_message_valid_data)
        self.assertStatusCode(res, 201)
        pk = MessageForum.objects.last().pk
        check_results(pk, 0, 0)

        # Upvote.
        self.login("17simple")
        self.vote_up(pk)
        check_results(pk, 1, 0)

        # Upvote a second time: does not change.
        self.login("17simple")
        self.vote_up(pk)
        check_results(pk, 1, 0)

        # Downvote.
        self.login("17simple")
        self.vote_down(pk)
        check_results(pk, 0, 1)

        # Someone else upvote.
        self.login("17admin")
        self.vote_up(pk)
        check_results(pk, 1, 1)
