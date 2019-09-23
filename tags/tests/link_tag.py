from associations.tests.base_test import BaseTestCase


class TagNamespaceTestCase(BaseTestCase):
    fixtures = ["test_authentication.yaml", "test_marketplace.yaml", "test_tags.yaml"]

    def test_add_global_tag(self):
        self.login("17simple")
        res = self.post("/tags/links/product/2/", {"tag": 1})
        self.assertStatusCode(res, 200)

        res = self.get("/tags/link/product/2/")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(
            res.content,
            {
                "tags": [
                    {
                        "id": 1,
                        "value": "17bocquet",
                        "url": None,
                        "namespace": {"id": 1, "scope": "global", "name": "user"},
                    }
                ]
            },
        )

        res = self.delete("/tags/link/product/2/", {"tag": 1})
        self.assertStatusCode(res, 200)

    def test_remove_global_tag(self):
        self.login("17simple")

        res = self.get("/tags/link/product/2/")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res, {"tags": []})

    def test_add_scoped_tag(self):
        self.login("17simple")
        res = self.post("/tags/link/product/2/", {"tag": 1})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.post("/tags/link/product/2/", {"tag": 1})
        self.assertStatusCode(res, 200)

        res = self.get("/tags/link/product/2/")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(
            res,
            {
                "tags": [
                    {
                        "id": "1",
                        "value": "17bocquet",
                        "url": "",
                        "namespace": {
                            "id": 2,
                            "scope": "association",
                            "scoped_to": "pdm",
                        },
                    }
                ]
            },
        )

    def test_remove_scoped_tag(self):
        # add the tag
        self.login("17admin_pdm")
        res = self.post("/tags/link/product/2/", {"tag": 1})
        self.assertStatusCode(res, 200)

        # remove the tag
        self.login("17simple")
        res = self.delete("/tags/link/product/2/", {"tag": 1})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.delete("/tags/link/product/2/", {"tag": 1})
        self.assertStatusCode(res, 200)

        res = self.get("/tags/link/product/2/")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res, {"tags": []})
