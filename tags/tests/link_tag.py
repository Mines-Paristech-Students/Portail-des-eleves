import json

from associations.tests.base_test import BaseTestCase


class TagNamespaceTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_marketplace.yaml", "test_tags.yaml"]

    def test_add_global_tag(self):
        self.login("17simple")
        res = self.post("/tags/link/product/2/tag/1/")
        self.assertStatusCode(res, 201)

        res = self.get("/associations/products/2/")
        self.assertStatusCode(res, 200)
        self.assertEqual(
            json.loads(res.content).get("tags"),
            [
                {
                    "id": 1,
                    "value": "17bocquet",
                    "url": None,
                    "namespace": {"id": 1, "scope": "global", "name": "user"},
                }
            ],
        )

    def test_remove_global_tag(self):
        self.login("17simple")

        res = self.post("/tags/link/product/2/tag/1/")
        self.assertStatusCode(res, 201)

        res = self.delete("/tags/link/product/2/tag/1/")
        self.assertStatusCode(res, 204)

        res = self.get("/associations/products/2/")
        self.assertStatusCode(res, 200)
        self.assertEqual(json.loads(res.content)["tags"], [])

    def test_add_scoped_tag(self):
        self.login("17simple")
        res = self.post("/tags/link/product/2/tag/3/")
        self.assertStatusCode(res, 403)

        self.login("17admin_biero")
        res = self.post("/tags/link/product/2/tag/3/")
        self.assertStatusCode(res, 201)

        res = self.get("/associations/products/2/")
        self.assertStatusCode(res, 200)
        self.assertEqual(
            json.loads(res.content)["tags"],
            [
                {
                    "id": 3,
                    "value": "farine",
                    "url": None,
                    "namespace": {"id": 2, "scope": "association", "scoped_to": "pdm"},
                }
            ],
        )

    def test_remove_scoped_tag(self):
        # add the tag
        self.login("17admin_biero")
        res = self.post("/tags/link/product/2/tag/3/")
        self.assertStatusCode(res, 200)

        # remove the tag
        self.login("17simple")
        res = self.delete("/tags/link/product/2/tag/3/")
        self.assertStatusCode(res, 403)

        self.login("17admin_biero")
        res = self.delete("/tags/link/product/2/tag/3/")
        self.assertStatusCode(res, 200)

        res = self.get("/associations/products/2/")
        self.assertStatusCode(res, 200)
        self.assertEqual(json.loads(res.content)["tags"], [])
