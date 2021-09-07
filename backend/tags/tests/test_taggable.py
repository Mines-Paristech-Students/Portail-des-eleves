from tags.tests.base_test import TagsBaseTestCase


class TaggableCase(TagsBaseTestCase):
    fixtures = ["test_taggable.yaml"]
    maxDiff = None

    def test_related_to_filter(self):
        self.login("17bocquet")

        res = self.get("/associations/media/")
        self.assertStatusCode(res, 200)
        self.assertEqual(set([x["id"] for x in res.data["results"]]), {1, 2, 3, 4})

        res = self.get("/associations/media/?tags__are=1")
        self.assertStatusCode(res, 200)
        self.assertEqual(set([x["id"] for x in res.data["results"]]), {1, 2})

        res = self.get("/associations/media/?tags__are=2")
        self.assertStatusCode(res, 200)
        self.assertEqual(set([x["id"] for x in res.data["results"]]), {2, 3})

        res = self.get("/associations/media/?tags__are=1,2")
        self.assertStatusCode(res, 200)
        self.assertEqual(set([x["id"] for x in res.data["results"]]), {2})

    def test_is_and_on_namespace_but_or_inside_namespace(self):
        """Check that when we filter by tags, if the tags are in the same namespace we get the union of the results
        for these tags. If they are in different namespaces, we should get the intersection

        ex1: tag_1_namespace_1, tag_2_namespace_1 => tag_1_namespace_1 OR tag_2_namespace_1

        ex2: tag_1_namespace_1, tag_1_namespace_2 => tag_1_namespace_1 AND tag_1_namespace_2

        ex3: tag_1_namespace_1, tag_2_namespace_1, tag_2_namespace_1 =>
         (tag_1_namespace_1 OR tag_2_namespace_1) AND tag_1_namespace_2
        """
        self.login("17bocquet")

        # Intersection
        res = self.get("/associations/media/?tags__are=1,2")
        self.assertStatusCode(res, 200)
        self.assertEqual(set([x["id"] for x in res.data["results"]]), {2})

        # Union
        res = self.get("/associations/media/?tags__are=2,4")
        self.assertStatusCode(res, 200)
        self.assertEqual(set([x["id"] for x in res.data["results"]]), {1, 2, 3})

        # Union and intersection
        res = self.get("/associations/media/?tags__are=2,3,4")
        self.assertStatusCode(res, 200)
        self.assertEqual(set([x["id"] for x in res.data["results"]]), {1})
