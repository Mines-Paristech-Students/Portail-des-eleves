import datetime

from associations.models import (
    Association,
    Election,
    Library,
    Loanable,
    Marketplace,
    Media,
    Page,
    Product,
    Role,
)
from authentication.models import User
from tags.models import Tag
from tags.tests.base_test import TagsBaseTestCase


class HidingTestCase(TagsBaseTestCase):
    """
    * Test every model which has a ViewSet, even if this model cannot have a Tag (test_hiding_***)
    * Test the nested representations of the models which can have a Tag (test_hiding_nested_***_from_***).
    * Test if some endpoints have changed and now return tagged models which have not been tested yet.
      In that case, display a message urging to implement the test.
    """

    fixtures = ["test_authentication.yaml", "test_hiding.yaml"]
    maxDiff = None

    def setUp(self):
        """Give a “hiding” `Tag` to an instance of each taggable model."""
        links = [
            (Association, "hidden_association"),
            (Loanable, 3),
            (Media, 3),
            (Page, 3),
            (Product, 3),
            (Role, 3),
        ]

        hiding_tag = Tag.objects.get(pk=1)

        for (model, pk) in links:
            instance = model.objects.get(pk=pk)
            instance.tags.add(hiding_tag)
            instance.save()
        hiding_tag.save()

        super(HidingTestCase, self).setUp()

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
        self.assertEqual(len(response.data["results"]), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all associations, but one should be missing

        response = self.get("/associations/associations/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/associations/hidden_association/")
        self.assertStatusCode(response, 404)

    def test_hiding_elections(self):
        self.login("17simple")

        #########################################
        # Get all elections

        response = self.get("/associations/elections/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all elections, but one should be missing

        response = self.get("/associations/elections/")
        self.assertEqual(len(response.data["results"]), 1)
        for item in response.data["results"]:
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
        self.assertEqual(len(response.data["results"]), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all events, but one should be missing

        response = self.get("/associations/events/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/events/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_fundings(self):
        self.login("17simple")

        #########################################
        # Get all objects

        response = self.get("/associations/fundings/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all objects, but one should be missing

        response = self.get("/associations/fundings/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/fundings/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_library(self):
        self.login("17simple")

        #########################################
        # Get all libraries

        response = self.get("/associations/library/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all library, but one should be missing

        response = self.get("/associations/library/")
        self.assertEqual(len(response.data["results"]), 1)
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["id"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/library/hidden_association/")
        self.assertStatusCode(response, 404)

    def test_hiding_loanables(self):
        self.login("17simple")

        #########################################
        # Get all objects

        response = self.get("/associations/loanables/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all objects, but one should be missing

        response = self.get("/associations/loanables/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/loanables/2/")
        self.assertStatusCode(response, 404)
        response = self.get("/associations/loanables/3/")
        self.assertStatusCode(response, 404)

    def test_hiding_loans(self):
        self.login("17simple")

        #########################################
        # Get all objects

        response = self.get("/associations/loans/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all objects, but one should be missing

        response = self.get("/associations/loans/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/loans/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_marketplace(self):
        self.login("17simple")

        #########################################
        # Get all marketplaces

        response = self.get("/associations/marketplace/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all marketplaces, but one should be missing

        response = self.get("/associations/marketplace/")
        self.assertEqual(len(response.data["results"]), 1)
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["id"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/marketplace/hidden_association/")
        self.assertStatusCode(response, 404)

    def test_hiding_media(self):
        self.login("17simple")

        #########################################
        # Get all media

        response = self.get("/associations/media/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all media, but one should be missing

        response = self.get("/associations/media/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        for i in range(2, 4):
            response = self.get(f"/associations/media/{i}/")
            self.assertStatusCode(response, 404)

    def test_hiding_pages(self):
        self.login("17simple")

        #########################################
        # Get all pages

        response = self.get("/associations/pages/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all pages, but one should be missing

        response = self.get("/associations/pages/")
        self.assertEqual(len(response.data["results"]), 1)
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["text"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/pages/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_product(self):
        self.login("17simple")

        #########################################
        # Get all products

        response = self.get("/associations/products/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all products, but two should be missing

        response = self.get("/associations/products/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["name"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/products/2/")
        self.assertStatusCode(response, 404)
        response = self.get("/associations/products/3/")
        self.assertStatusCode(response, 404)

    def test_hiding_transaction(self):
        self.login("17simple")

        #########################################
        # Get all objects

        response = self.get("/associations/transactions/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 2)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all objects, but one should be missing

        response = self.get("/associations/transactions/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/transactions/2/")
        self.assertStatusCode(response, 404)

    def test_hiding_role(self):
        self.login("17simple")

        #########################################
        # Get all roles

        response = self.get("/associations/roles/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 3)

        self.switch_17simple_to_first_year()
        ###########################################
        # Get all roles, but one should be missing

        response = self.get("/associations/roles/")
        self.assertEqual(len(response.data["results"]), 1, msg=response.data["results"])
        for item in response.data["results"]:
            self.assertNotIn("hidden", item["role"])

        # Cannot directly access a hidden object.
        response = self.get("/associations/roles/2/")
        self.assertStatusCode(response, 404)
        response = self.get("/associations/roles/3/")
        self.assertStatusCode(response, 404)

    ##################
    # NESTED OBJECTS #
    ##################

    def test_hiding_nested_loanables_from_library(self):
        # Can see all the loanables in the library.
        self.login("17simple")

        for library in Library.objects.all():
            response = self.get(f"/associations/library/{library.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.data["loanables"]), library.loanables.count())

        # Cannot see the hidden loanables in the library.
        self.switch_17simple_to_first_year()

        # Use a library which is not hidden.
        for library in Library.objects.exclude(association__tags__is_hidden=True):
            response = self.get(f"/associations/library/{library.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                len(response.data["loanables"]),
                library.loanables.exclude(tags__is_hidden=True).count(),
            )

            for loanable in response.data["loanables"]:
                self.assertNotIn("hidden", loanable["name"])

    def test_no_media_in_association(self):
        self.login("17simple")

        response = self.get("/associations/associations/public_association/")
        self.assertEqual(response.status_code, 200)

        # Check if `response.data["results"]` is what we think it is.
        self.assertEqual(response.data["name"], "Public association")

        msg = (
            "It seems that `associations/public_association` now returns a list of medias.\n"
            "Please make sure to test accordingly."
        )
        self.assertNotIn("media", response.data, msg=msg)
        self.assertNotIn("medias", response.data, msg=msg)

    def test_hiding_nested_products_from_marketplace(self):
        # Can see all the products in the marketplace.
        self.login("17simple")

        for marketplace in Marketplace.objects.all():
            response = self.get(f"/associations/marketplace/{marketplace.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                len(response.data["products"]), marketplace.products.count()
            )

        # Cannot see the hidden products in the marketplace.
        self.switch_17simple_to_first_year()

        # Use a marketplace which is not hidden.
        for marketplace in Marketplace.objects.exclude(
            association__tags__is_hidden=True
        ):
            response = self.get(f"/associations/marketplace/{marketplace.id}/")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                len(response.data["products"]),
                marketplace.products.exclude(tags__is_hidden=True).count(),
            )

            for product in response.data["products"]:
                self.assertNotIn("hidden", product["name"])

    def test_no_roles_in_association(self):
        self.login("17simple")

        response = self.get("/associations/associations/public_association/")
        self.assertEqual(response.status_code, 200)

        # Check if `response.data["results"]` is what we think it is.
        self.assertEqual(response.data["name"], "Public association")

        msg = (
            "It seems that `associations/public_association` now returns a list of roles.\n"
            "Please make sure to test accordingly."
        )
        self.assertNotIn("role", response.data, msg=msg)
        self.assertNotIn("roles", response.data, msg=msg)

    def test_if_not_tag_manager_then_no_access_to_namespaces(self):
        self.login("17simple")

        response = self.get("/tags/namespaces/1/")
        self.assertEqual(response.status_code, 403)
