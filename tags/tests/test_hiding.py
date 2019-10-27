import datetime

from django.db.models import Q

from associations.models import Association, Media, Page, Role
from authentication.models import User
from forum.models import Theme, Topic, MessageForum
from tags.models import Tag
from tags.tests.base_test import BaseTestCase


class HidingTestCase(BaseTestCase):
    """
        * Test every model which has a ViewSet, even if this model cannot have a Tag (test_hiding_***)
        * Test the nested representations of the models which can have a Tag (test_hiding_nested_***_from_***).
        * Test if some endpoints have changed and now return tagged models which have not been tested yet.
          In that case, display a message urging to implement the test.
    """

    fixtures = ["test_authentication.yaml", "test_hiding.yaml"]
    maxDiff = None

    def setUp(self):
        links = [
            (Association, "hidden_association"),
            (Folder, 4),
            (Media, 3),
            (Page, 3),
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
        self.assertFalse(User.objects.get(pk="17simple").show)

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

        # Cannot directly access a hidden object.
        response = self.get("/associations/associations/hidden_association/")
        self.assertStatusCode(response, 404)

    def test_hiding_elections(self):
        self.login("17simple")

        #########################################
        # Get all associations

        response = self.get("/associations/elections/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all associations, but one should be missing

        response = self.get("/associations/elections/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/elections/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_events(self):
        self.login("17simple")

        #########################################
        # Get all events

        response = self.get("/associations/events/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all events, but one should be missing

        response = self.get("/associations/events/")
        self.assertEqual(len(response.data), 1, msg=response.data)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/events/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_files(self):
        self.login("17simple")

        #########################################
        # Get all files

        response = self.get("/associations/files/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 5)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all files, but one should be missing

        response = self.get("/associations/files/")
        self.assertEqual(len(response.data), 1, msg=response.data)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        for i in range(2, 6):
            response = self.get(f"/associations/files/{i}/")
            self.assertStatusCode(response, 404)

    def test_hiding_folders(self):
        self.login("17simple")

        #########################################
        # Get all folders

        response = self.get("/associations/folders/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 5)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all folders, but one should be missing

        response = self.get("/associations/folders/")
        self.assertEqual(len(response.data), 1, msg=response.data)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        for i in range(2, 6):
            response = self.get(f"/associations/folders/{i}/")
            self.assertStatusCode(response, 404)

    def test_hiding_fundings(self):
        self.login("17simple")

        #########################################
        # Get all folders

        response = self.get("/associations/fundings/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all folders, but one should be missing

        response = self.get("/associations/fundings/")
        self.assertEqual(len(response.data), 1, msg=response.data)

        # Cannot directly access a hidden object.
        response = self.get("/associations/fundings/2/")
        self.assertStatusCode(response, 404)

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
            self.assertNotIn("hidden", item["id"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/library/hidden_association/")
        self.assertStatusCode(response, 404)

    def test_hiding_loans(self):
        self.login("17simple")

        #########################################
        # Get all folders

        response = self.get("/associations/loans/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all folders, but one should be missing

        response = self.get("/associations/loans/")
        self.assertEqual(len(response.data), 1, msg=response.data)

        # Cannot directly access a hidden object.
        response = self.get("/associations/loans/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_loanables(self):
        self.login("17simple")

        #########################################
        # Get all folders

        response = self.get("/associations/loanables/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all folders, but one should be missing

        response = self.get("/associations/loanables/")
        self.assertEqual(len(response.data), 1, msg=response.data)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/loanables/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_marketplace(self):
        self.login("17simple")

        #########################################
        # Get all marketplaces

        response = self.get("/associations/marketplace/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all marketplaces, but one should be missing

        response = self.get("/associations/marketplace/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["id"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/marketplace/hidden_association/")
        self.assertStatusCode(response, 404)

    def test_hiding_pages(self):
        self.login("17simple")

        #########################################
        # Get all pages

        response = self.get("/associations/pages/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all pages, but one should be missing

        response = self.get("/associations/pages/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["text"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/pages/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_product(self):
        self.login("17simple")

        #########################################
        # Get all folders

        response = self.get("/associations/products/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all folders, but one should be missing

        response = self.get("/associations/products/")
        self.assertEqual(len(response.data), 1, msg=response.data)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/products/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_role(self):
        self.login("17simple")

        #########################################
        # Get all roles

        response = self.get("/associations/roles/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all roles, but one should be missing

        response = self.get("/associations/roles/")
        self.assertEqual(len(response.data), 1, msg=response.data)
        for item in response.data:
            self.assertNotIn("hidden", item["role"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/roles/2/")
        self.assertStatusCode(response, 404)
        response = self.get("/associations/roles/3/")
        self.assertStatusCode(response, 404)

    def test_hiding_transaction(self):
        self.login("17simple")

        #########################################
        # Get all folders

        response = self.get("/associations/transactions/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all folders, but one should be missing

        response = self.get("/associations/transactions/")
        self.assertEqual(len(response.data), 1, msg=response.data)

        # Cannot directly access a hidden object.
        response = self.get("/associations/transactions/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_theme(self):
        self.login("17simple")

        #########################################
        # Get all themes

        response = self.get("/forum/themes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all themes, but one should be missing

        response = self.get("/forum/themes/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/forum/themes/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_topic(self):
        self.login("17simple")

        #########################################
        # Get all topics

        response = self.get("/forum/topics/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all topics, but one should be missing

        response = self.get("/forum/topics/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/forum/topics/2/")
        self.assertStatusCode(response, 404)
        response = self.get("/forum/topics/3/")
        self.assertStatusCode(response, 404)

    def test_hiding_messages_forum(self):
        self.login("17simple")

        #########################################
        # Get all forum_messages

        response = self.get("/forum/messages/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all forum_messages, but one should be missing

        response = self.get("/forum/messages/")
        self.assertEqual(len(response.data), 1)
        for item in response.data:
            self.assertNotIn("hidden", item["text"])

        # Cannot directly access a hidden object.
        for i in range(2, 5):
            response = self.get(f"/forum/messages/{i}/")
            self.assertStatusCode(response, 404)

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

    def test_hiding_nested_files_from_folder(self):
        # Can see all the files in the folder.
        self.login("17simple")

        for folder in Folder.objects.all():
            response = self.get(f"/associations/folders/{folder.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data["files"]), folder.files.count())

        # Cannot see the hidden files in the folder.
        self.switch_17simple_to_first_year()

        # Use a folder which is not hidden.
        for folder in Folder.objects.exclude(
            Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True)
        ):
            response = self.get(f"/associations/folders/{folder.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                len(response.data["files"]),
                folder.files.exclude(tags__is_hidden=True).count(),
            )

            for file in response.data["files"]:
                self.assertNotIn("hidden_file", file["name"])

    def test_no_files_in_association(self):
        self.login("17simple")

        response = self.get("/associations/associations/public_association/")
        self.assertEqual(response.status_code, 200)

        msg = (
            "It seems that `associations/public_association` now returns a list of files.\n"
            "Please make sure to test accordingly."
        )
        self.assertNotIn("file", response.data, msg=msg)
        self.assertNotIn("files", response.data, msg=msg)

    def test_hiding_nested_folders_from_folder(self):
        # Can see all the folders in the folder.
        self.login("17simple")

        for folder in Folder.objects.all():
            response = self.get(f"/associations/folders/{folder.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data["children"]), folder.children.count())

        # Cannot see the hidden files in the folder.
        self.switch_17simple_to_first_year()

        # Use a folder which is not hidden.
        for folder in Folder.objects.exclude(
            Q(tags__is_hidden=True) | Q(association__tags__is_hidden=True)
        ):
            response = self.get(f"/associations/folders/{folder.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                len(response.data["children"]),
                folder.children.exclude(tags__is_hidden=True).count(),
            )

            for child in response.data["children"]:
                self.assertNotIn("hidden_folder", child["name"])

    def test_no_folders_in_association(self):
        self.login("17simple")

        response = self.get("/associations/associations/public_association/")
        self.assertEqual(response.status_code, 200)

        msg = (
            "It seems that `associations/public_association` now returns a list of folders.\n"
            "Please make sure to test accordingly."
        )
        self.assertNotIn("folder", response.data, msg=msg)
        self.assertNotIn("folders", response.data, msg=msg)

    def test_hiding_nested_pages_from_association(self):
        # Can see all the pages in the association.
        self.login("17simple")

        for association in Association.objects.all():
            response = self.get(f"/associations/associations/{association.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data["pages"]), association.pages.count())

        # Cannot see the hidden pages in the association.
        self.switch_17simple_to_first_year()

        # Use an association which is not hidden.
        for association in Association.objects.exclude(tags__is_hidden=True):
            response = self.get(f"/associations/associations/{association.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                len(response.data["pages"]),
                association.pages.exclude(tags__is_hidden=True).count(),
            )

            for page in response.data["pages"]:
                self.assertNotIn("hidden", page["title"])

    def test_no_roles_in_association(self):
        self.login("17simple")

        response = self.get("/associations/associations/public_association/")
        self.assertEqual(response.status_code, 200)

        msg = (
            "It seems that `associations/public_association` now returns a list of roles.\n"
            "Please make sure to test accordingly."
        )
        self.assertNotIn("role", response.data, msg=msg)
        self.assertNotIn("roles", response.data, msg=msg)

    def test_hiding_nested_topics_from_theme(self):
        # Can see all the topics in the theme.
        self.login("17simple")

        for theme in Theme.objects.all():
            response = self.get(f"/forum/themes/{theme.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data["topics"]), theme.topics.count())

        # Cannot see the hidden topics in the theme.
        self.switch_17simple_to_first_year()

        # Use a theme which is not hidden.
        for theme in Theme.objects.exclude(tags__is_hidden=True):
            response = self.get(f"/forum/themes/{theme.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                len(response.data["topics"]),
                theme.topics.exclude(tags__is_hidden=True).count(),
            )

            for topic in response.data["topics"]:
                self.assertNotIn("hidden", topic["name"])
