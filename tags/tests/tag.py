from associations.tests.base_test import BaseTestCase


class TagNamespaceTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_marketplace.yaml', 'test_tags.yaml']

    def test_add_global_tag(self):
        self.login("17simple")
        res = self.post("tags/models/product/2/", {"tag": 1})
        self.assertStatusCode(res, 200)

        res = self.get("tags/products/2")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res, {
            "tags": [
                {
                    "id": "1",
                    "value": "17bocquet",
                    "url": "",
                    "namespace": {
                        "id": 2,
                        "scope": "association",
                        "scoped_to": "pdm"
                    }
                }
            ]
        })

        res = self.delete("tags/models/product/2", {"tag": 1})
        self.assertStatusCode(res, 200)

    def test_remove_global_tag(self):
        self.login("17simple")

        res = self.get("tags/products/2")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res, {"tags": []})

    def test_create_global_tag(self):
        self.login("17simple")
        res = self.post("tags/models/product/2", {"namespace": 1, "value": "17wan-fat"})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.post("tags/models/product/2", {"namespace": 1, "value": "17wan-fat"})
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.post("tags/models/product/2", {"namespace": 1, "value": "17wan-fat"})
        self.assertStatusCode(res, 201)

    def test_delete_global_tag(self):
        # Add the tag
        self.login("17admin")
        res = self.post("tags/models/product/2", {"namespace": 1, "value": "17wan-fat"})
        self.assertStatusCode(res, 201)

        # Test: try to remove it
        self.login("17simple")
        res = self.delete("tags/models/product/2", {"tag": "1"})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.delete("tags/models/product/2", {"tag": "1"})
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.delete("tags/models/product/2", {"tag": "1"})
        self.assertStatusCode(res, 203)

    def test_add_scoped_tag(self):
        self.login("17simple")
        res = self.post("tags/models/product/2", {"tag": 1})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.post("tags/models/product/2", {"tag": 1})
        self.assertStatusCode(res, 200)

        res = self.get("tags/products/2")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res, {
            "tags": [
                {
                    "id": "1",
                    "value": "17bocquet",
                    "url": "",
                    "namespace": {
                        "id": 2,
                        "scope": "association",
                        "scoped_to": "pdm"
                    }
                }
            ]
        })

    def test_remove_scoped_tag(self):
        # add the tag
        self.login("17admin_pdm")
        res = self.post("tags/models/product/2", {"tag": 1})
        self.assertStatusCode(res, 200)

        # remove the tag
        self.login("17simple")
        res = self.delete("tags/models/product/2", {"tag": 1})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.delete("tags/models/product/2", {"tag": 1})
        self.assertStatusCode(res, 200)

        res = self.get("tags/products/2")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res, {"tags": []})

    def test_create_scoped_tag(self):
        self.login("17simple")
        res = self.post("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.post("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.post("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)

        namespace = {"id": 2, "scope": "association", "scoped_to": "pdm"}
        res = self.get("tags/scope/association/pdm")
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res.content, {"tags": [
            {"id": 2, "value": "sarrasin", "url": "", "namespace": namespace},
            {"id": 3, "value": "blé", "url": "", "namespace": namespace},
            {"id": 4, "value": "orge", "url": "", "namespace": namespace},
        ]})

    def test_delete_scoped_tag(self):
        # Create the tag
        self.login("17admin_pdm")
        res = self.post("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)

        ##################################
        # Make the test

        self.login("17simple")
        res = self.delete("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.delete("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 403)

        self.login("17admin_pdm")
        res = self.delete("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)

    def test_create_same_tage_twice(self):
        self.login("17admin_pdm")

        res = self.post("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)

        res = self.post("tags/model/product/2", {"namespace": 2, "value": "orge"})
        self.assertStatusCode(res, 201)

        res = self.get('tags/scope/assciation/pdm')
        namespace = {"id": 2, "scope": "association", "scoped_to": "pdm"}
        self.assertJSONEqual(res.content, {"tags": [
            {"id": 2, "value": "sarrasin", "url": "", "namespace": namespace},
            {"id": 3, "value": "blé", "url": "", "namespace": namespace},
            {"id": 4, "value": "orge", "url": "", "namespace": namespace},
        ]})

    def test_add_tag_to_non_owned_namepace(self):
        self.login("17admin_pdm")

        res = self.post("tags/model/product/2", {"namespace": 3, "value": "orge"})
        self.assertStatusCode(res, 403)
