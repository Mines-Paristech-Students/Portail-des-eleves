from tags.tests.base_test import TagsBaseTestCase


class TaggableCase(TagsBaseTestCase):
    fixtures = ["test_taggable.yaml"]
    maxDiff = None

    def test_related_to_filter(self):
        self.login("17bocquet")

        res = self.get("/associations/media/")
        self.assertStatusCode(res, 200)
        self.assertEqual(set(map(lambda x: x["id"], res.data["results"])), {1, 2, 3, 4})

        res = self.get("/associations/media/?tags__are=1")
        self.assertStatusCode(res, 200)
        self.assertEqual(set(map(lambda x: x["id"], res.data["results"])), {1, 2})

        res = self.get("/associations/media/?tags__are=2")
        self.assertStatusCode(res, 200)
        self.assertEqual(set(map(lambda x: x["id"], res.data["results"])), {2, 3})

        res = self.get("/associations/media/?tags__are=1,2")
        self.assertStatusCode(res, 200)
        self.assertEqual(set(map(lambda x: x["id"], res.data["results"])), {2})
