from tags.tests.base_test import TagsBaseTestCase


class TagRelatedToCase(TagsBaseTestCase):
    fixtures = ["test_related_to.yaml"]
    maxDiff = None

    def test_related_to_filter(self):
        self.login("17bocquet")

        res = self.get("/tags/tags/")
        self.assertStatusCode(res, 200)
        self.assertEqual(set(map(lambda x: x["id"], res.data["results"])), {1, 2, 3, 4})

        res = self.get("/tags/tags/?related_to=media")
        self.assertStatusCode(res, 200)
        self.assertEqual(set(map(lambda x: x["id"], res.data["results"])), {1, 3})

        res = self.get("/tags/tags/?related_to=product")
        self.assertStatusCode(res, 200)
        self.assertEqual(set(map(lambda x: x["id"], res.data["results"])), {2, 3})

        res = self.get("/tags/tags/?related_to=media,product")
        self.assertStatusCode(res, 200)
        self.assertEqual(set(map(lambda x: x["id"], res.data["results"])), {1, 2, 3})
