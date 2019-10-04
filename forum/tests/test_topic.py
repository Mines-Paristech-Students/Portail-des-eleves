from backend.tests_utils import BaseTestCase
from forum.models import Topic


class TopicTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_forum.yaml"]

    ALL_USERS = ["17admin", "17simple"]
    """A list of user ids covering all the spectrum of roles and permissions."""

    def endpoint_list(self):
        return "/forum/topics/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/forum/topics/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    def endpoint_create(self):
        return "/forum/topics/"

    def create(self, data=None, format="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, format, content_type)

    def endpoint_update(self, pk):
        return f"/forum/topics/{pk}/"

    def update(self, pk, data=None, format="json", content_type="application/json"):
        return self.patch(self.endpoint_update(pk), data, format, content_type)

    def endpoint_destroy(self, pk):
        return f"/forum/topics/{pk}/"

    def destroy(self, pk, data="", format=None, content_type=None):
        return self.delete(self.endpoint_destroy(pk), data, format, content_type)

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_topics(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_topics(self):
        self.login("17simple")
        res = self.list()
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_topic(self):
        res = self.retrieve(pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_topic(self):
        self.login("17simple")
        res = self.retrieve(pk=1)
        self.assertStatusCode(res, 200)

    def test_if_topic_does_not_exist_then_404(self):
        self.login("17simple")
        res = self.retrieve(pk=42)
        self.assertFalse(Topic.objects.filter(pk="42").exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    create_topic_valid_data = {
        "name": "Pourquoi avez-vous choisi les Mines?",
        "theme": 1,
    }

    def test_can_create_topic(self):
        for user in self.ALL_USERS:
            self.login(user)

            res = self.create(self.create_topic_valid_data)
            self.assertStatusCode(res, 201)
            last_topic = Topic.objects.last()
            self.assertEqual(last_topic.name, self.create_topic_valid_data["name"])
            self.assertEqual(last_topic.theme.pk, self.create_topic_valid_data["theme"])
            self.assertEqual(last_topic.author.pk, user)

    create_topic_invalid_data_theme = {
        "name": "Pourquoi avez-vous choisi les Mines?",
        "theme": 42,
    }

    def test_if_theme_does_not_exist_then_cannot_create_topic(self):
        for user in self.ALL_USERS:
            self.login(user)

            length_before = Topic.objects.count()
            res = self.create(self.create_topic_invalid_data_theme)
            self.assertStatusCode(res, 400)
            self.assertEqual(Topic.objects.count(), length_before)

    create_topic_invalid_data_author = {
        "name": "Pourquoi avez-vous choisi les Mines?",
        "theme": 1,
        "author": "17bocquet",
    }

    def test_cannot_create_topic_for_another_user(self):
        for user in self.ALL_USERS:
            self.login(user)

            res = self.create(self.create_topic_invalid_data_author)
            self.assertStatusCode(res, 201)
            last_topic = Topic.objects.last()
            self.assertEqual(last_topic.name, self.create_topic_valid_data["name"])
            self.assertEqual(last_topic.theme.pk, self.create_topic_valid_data["theme"])
            # The topic was created, but the author is the current user.
            self.assertEqual(last_topic.author.pk, user)

    ##########
    # UPDATE #
    ##########

    update_topic_valid_data = {
        "name": "Pourquoi avez-vous choisi les Mines?",
        "theme": 2,
    }

    def test_if_not_global_admin_then_cannot_update_topics(self):
        self.login("17simple")

        topic_before = Topic.objects.get(pk=1)
        res = self.update(pk=1, data=self.update_topic_valid_data)
        self.assertStatusCode(res, 403)
        self.assertEqual(topic_before, Topic.objects.get(pk=1))

    def test_if_global_admin_then_can_update_topics(self):
        self.login("17admin")
        res = self.update(pk=1, data=self.update_topic_valid_data)
        self.assertStatusCode(res, 200)
        self.assertEqual(
            self.update_topic_valid_data["name"], Topic.objects.get(pk=1).name
        )
        self.assertEqual(
            self.update_topic_valid_data["theme"], Topic.objects.get(pk=1).theme.pk
        )

    update_topic_invalid_data_theme = {
        "name": "Pourquoi avez-vous choisi les Mines?",
        "theme": 42,
    }

    def test_cannot_update_to_invalid_theme(self):
        self.login("17admin")
        topic_before = Topic.objects.get(pk=1)
        res = self.update(pk=1, data=self.update_topic_invalid_data_theme)
        self.assertStatusCode(res, 400)
        self.assertEqual(topic_before, Topic.objects.get(pk=1))

    update_topic_invalid_data_author = {
        "name": "Pourquoi avez-vous choisi les Mines?",
        "theme": 2,
        "author": "17bocquet",
    }

    def test_cannot_update_author(self):
        self.login("17admin")
        topic_before = Topic.objects.get(pk=1)
        res = self.update(pk=1, data=self.update_topic_invalid_data_author)
        self.assertStatusCode(res, 200)
        self.assertEqual(
            self.update_topic_invalid_data_author["name"], Topic.objects.get(pk=1).name
        )
        self.assertEqual(
            self.update_topic_invalid_data_author["theme"],
            Topic.objects.get(pk=1).theme.pk,
        )
        self.assertNotEqual(
            self.update_topic_invalid_data_author["author"],
            Topic.objects.get(pk=1).author,
        )

    ###########
    # DESTROY #
    ###########

    def test_if_not_global_admin_then_cannot_destroy_topics(self):
        self.login("17simple")
        res = self.destroy(pk=1)
        self.assertStatusCode(res, 403)
        self.assertTrue(Topic.objects.filter(pk=1).exists())

    def test_if_global_admin_then_can_destroy_topics(self):
        self.login("17admin")
        res = self.destroy(pk=1)
        self.assertStatusCode(res, 204)
        self.assertFalse(Topic.objects.filter(pk=1).exists())
