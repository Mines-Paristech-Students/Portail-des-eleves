from tags.models import Tag
from tags.tests.base_test import TagsBaseTestCase


class TagNamespaceTestCase(TagsBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_marketplace.yaml", "test_tags.yaml"]
    maxDiff = None

    def test_create_global_tag(self):
        self.login("17simple")
        res = self.post("/tags/tags/", {"namespace": 1, "value": "17wan-fat"})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.post("/tags/tags/", {"namespace": 1, "value": "17wan-fat"})
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.post("/tags/tags/", {"namespace": 1, "value": "17wan-fat"})
        self.assertStatusCode(res, 201)

    def test_delete_global_tag(self):
        # Add the tag
        self.login("17admin")
        res = self.post("/tags/tags/", {"namespace": 1, "value": "17wan-fat"})
        self.assertStatusCode(res, 201)
        tag = res.json()

        # Test: try to remove it
        self.login("17simple")
        res = self.delete("/tags/tags/{}/".format(tag["id"]))
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.delete("/tags/tags/{}/".format(tag["id"]))
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.delete("/tags/tags/{}/".format(tag["id"]))
        self.assertStatusCode(res, 204)

    def test_create_scoped_tag(self):
        self.login("17simple")
        res = self.post("/tags/tags/", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.post("/tags/tags/", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.post("/tags/tags/", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)

    def test_delete_scoped_tag(self):
        # Create the tag
        self.login("17admin_pdm")
        res = self.post("/tags/tags/", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)
        tag = res.json()

        ##################################
        # Make the test

        self.login("17simple")
        res = self.delete("/tags/tags/{}/".format(tag["id"]))
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.delete("/tags/tags/{}/".format(tag["id"]))
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.delete("/tags/tags/{}/".format(tag["id"]))
        self.assertStatusCode(res, 204)

    def test_create_same_tag_twice(self):
        self.login("17admin_pdm")

        length_before = Tag.objects.all().count()

        res = self.post("/tags/tags/", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)
        self.assertEqual(length_before + 1, Tag.objects.all().count())

        res = self.post("/tags/tags/", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)
        self.assertEqual(length_before + 1, Tag.objects.all().count())

    def test_create_tag_in_non_owned_namepace(self):
        self.login("17admin_pdm")

        res = self.post("/tags/tags/", {"namespace": 3, "value": "orge"})
        self.assertStatusCode(res, 403)
