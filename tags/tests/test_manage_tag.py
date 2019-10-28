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

        namespace = {
            "id": 2,
            "scoped_to_model": "association",
            "scoped_to_pk": "pdm",
            "name": "farine",
        }
        res = self.get("/tags/scope/association/pdm/")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(
            res.content,
            {
                "tags": [
                    {"id": 2, "value": "sarrasin", "namespace": namespace},
                    {"id": 3, "value": "blé", "namespace": namespace},
                    {"id": 7, "value": "orge", "namespace": namespace},
                ]
            },
        )

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

        res = self.post("/tags/tags/", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)

        res = self.post("/tags/tags/", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)

        res = self.get("/tags/tags/", {"scope": "association", "scope_id": "pdm"})
        namespace = {
            "id": 2,
            "name": "farine",
            "scoped_to_model": "association",
            "scoped_to_pk": "pdm",
        }
        self.assertJSONEqual(
            res.content,
            [
                {"id": 2, "value": "sarrasin", "namespace": namespace},
                {"id": 3, "value": "blé", "namespace": namespace},
                {"id": 6, "value": "orge", "namespace": namespace},
            ],
        )

    def test_create_tag_in_non_owned_namepace(self):
        self.login("17admin_pdm")

        res = self.post("/tags/tags/", {"namespace": 3, "value": "orge"})
        self.assertStatusCode(res, 403)
