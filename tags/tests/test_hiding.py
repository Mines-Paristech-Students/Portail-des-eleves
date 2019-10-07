import datetime

from django.db.models import Q

from associations.models import (
    Event,
    Association,
    Folder,
    File,
    Loanable,
    Page,
    Product,
    Role,
)
from authentication.models import User
from forum.models import Theme, Topic, MessageForum
from tags.models import Tag
from tags.tests.base_test import BaseTestCase


class HidingTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_hiding.yaml"]
    maxDiff = None

    def setUp(self):
        links = [
            (Association, "hidden_association"),
            (Event, 2),
            (Folder, 4),
            (File, 3),
            (Loanable, 3),
            (Page, 3),
            (Product, 3),
            (Role, 3),
            (Theme, 2),
            (Topic, 3),
            (MessageForum, 4),
        ]

        hiding_tag = Tag.objects.get(pk=1)

        for (model, pk) in links:
            instance = model.objects.get(pk=pk)
            instance.tags.add(hiding_tag)
            instance.save()
        hiding_tag.save()

    def switch_17simple_to_first_year(self):
        simple17 = User.objects.get(pk="17simple")
        now = datetime.datetime.now()
        simple17.year_of_entry = now.year
        simple17.save()

    def test_hiding_associations(self):
        self.login("17simple")

        #########################################
        # Get all associations

        response = self.get("/associations/associations/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all associations, but one should be missing

        response = self.get("/associations/associations/")
        self.assertEqual(len(response.data), 1, msg=response.data)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

    def test_hiding_library(self):
        self.login("17simple")

        #########################################
        # Get all libraries

        response = self.get("/associations/library/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all library, but one should be missing

        response = self.get("/associations/library/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["pk"])

    def test_hiding_marketplace(self):
        self.login("17simple")

        #########################################
        # Get all marketplaces

        response = self.get("/associations/marketplaces/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all marketplaces, but one should be missing

        response = self.get("/associations/marketplaces/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["pk"])

    def test_hiding_tag_namespaces(self):
        # self.login("17simple")
        #
        ##########################################
        # Get all namespaces
        #
        # response = self.get("/namespaces/")
        # self.assertEqual(response.status_code, 200)
        # self.assertEqual(len(response.data), 2)
        #
        # self.switch_17simple_to_first_year()
        ###########################################
        # Get all namespaces, but one should be missing

        # response = self.get("/namespaces/")
        # self.assertEqual(len(response.data), 1)
        # for item in response.data:
        #     self.assertNotIn("hidden", item["prop"])
        pass

    def test_hiding_events(self):
        self.login("17simple")

        #########################################
        # Get all events

        response = self.get("/events/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all events, but one should be missing

        response = self.get("/events/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

    def test_hiding_folders(self):
        self.login("17simple")

        #########################################
        # Get all folders

        response = self.get("/folders/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 5)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all folders, but one should be missing

        response = self.get("/folders/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

    def test_hiding_files(self):
        self.login("17simple")

        #########################################
        # Get all files

        response = self.get("/files/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 5)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all files, but one should be missing

        response = self.get("/files/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

    def test_hiding_loanables(self):
        self.login("17simple")

        #########################################
        # Get all loanables

        response = self.get("/loanables/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all loanables, but one should be missing

        response = self.get("/loanables/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

    def test_hiding_pages(self):
        self.login("17simple")

        #########################################
        # Get all pages

        response = self.get("/pages/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all pages, but one should be missing

        response = self.get("/pages/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["text"])

    def test_hiding_products(self):
        self.login("17simple")

        #########################################
        # Get all products

        response = self.get("/products/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all products, but one should be missing

        response = self.get("/products/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

    def test_hiding_role(self):
        self.login("17simple")

        #########################################
        # Get all roles

        response = self.get("/roles/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all roles, but one should be missing

        response = self.get("/roles/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["role"])

    def test_hiding_theme(self):
        self.login("17simple")

        #########################################
        # Get all themes

        response = self.get("/themes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all themes, but one should be missing

        response = self.get("/themes/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

    def test_hiding_topic(self):
        self.login("17simple")

        #########################################
        # Get all topics

        response = self.get("/topics/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all topics, but one should be missing

        response = self.get("/topics/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

    def test_hiding_forum_messages(self):
        self.login("17simple")

        #########################################
        # Get all forum_messages

        response = self.get("/forum_messages/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all forum_messages, but one should be missing

        response = self.get("/forum_messages/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["text"])
