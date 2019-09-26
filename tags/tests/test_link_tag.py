from tags.tests.base_test import BaseTestCase


class TagNamespaceTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_marketplace.yaml", "test_tags.yaml"]

    def test_add_global_tag(self):
        self.login("17simple")
        res = self.post("/tags/link/product/2/tag/1/")
        self.assertStatusCode(res, 201)

        res = self.get("/associations/products/2/")
        self.assertStatusCode(res, 200)
        self.assertEqual(
            res.json().get("tags"),
            [
                {
                    "id": 1,
                    "value": "17bocquet",
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
        self.assertEqual(res.json()["tags"], [])

    def test_add_scoped_tag(self):
        self.login("17simple")
        res = self.post("/tags/link/product/2/tag/4/")
        self.assertStatusCode(res, 403)

        self.login("17admin_biero")
        res = self.post("/tags/link/product/2/tag/4/")
        self.assertStatusCode(res, 201)

        self.maxDiff = None
        res = self.get("/associations/products/2/")
        self.assertStatusCode(res, 200)
        self.assertEqual(
            res.json()["tags"],
            [
                {
                    "id": 4,
                    "value": "IPA",
                    "namespace": {
                        "id": 3,
                        "scope": "association",
                        "scoped_to": "biero",
                        "name": "houblon",
                    },
                }
            ],
        )

    def test_remove_scoped_tag(self):
        # add the tag
        self.login("17admin_biero")
        res = self.post("/tags/link/product/2/tag/4/")
        self.assertStatusCode(res, 201)

        res = self.get("/associations/products/2/")
        self.assertStatusCode(res, 200)
        self.assertEqual(len(res.data["tags"]), 1)

        # remove the tag
        self.login("17simple")
        res = self.delete("/tags/link/product/2/tag/4/")
        self.assertStatusCode(res, 403)

        self.login("17admin_biero")
        res = self.delete("/tags/link/product/2/tag/4/")
        self.assertStatusCode(res, 204)

        res = self.get("/associations/products/2/")
        self.assertStatusCode(res, 200)
        self.assertEqual(res.data["tags"], [])

    def test_add_tag_from_other_namepace(self):
        self.login("17admin_biero")
        # product 2 is "jus de tomate" from biero, tag 3 belongs to namespace "farine" from pdm
        res = self.post("/tags/link/product/2/tag/3/")
        self.assertStatusCode(res, 403)
