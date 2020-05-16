import json

from tags.tests.base_test import TagsBaseTestCase


class TagNamespaceTestCase(TagsBaseTestCase):
    fixtures = ["test_authentication.yaml", "test_marketplace.yaml"]

    def test_create_scoped_namespace(self):
        ##############################
        # Creation of global namespace

        self.login("17admin")
        res = self.post(
            "/tags/namespaces/", {"scoped_to_model": "global", "name": "users"}
        )
        self.assertStatusCode(res, 201)

        # Check cannot create two global namespaces with the same name
        res = self.post(
            "/tags/namespaces/", {"scoped_to_model": "global", "name": "users"}
        )

        self.assertStatusCode(res, 400)

        ############################################
        # Creation of a namespace for an association

        self.login("17admin_pdm")
        res = self.post(
            "/tags/namespaces/",
            {"scoped_to_model": "association", "scoped_to_pk": "pdm", "name": "farine"},
        )
        self.assertStatusCode(res, 201)

        # Try to get all namespaces
        res = self.get("/tags/namespaces/")
        self.assertStatusCode(res, 200)
        self.assertEqual(len(res.data["results"]), 2)
        self.assertSetEqual(
            {n["name"] for n in res.data["results"]}, {"users", "farine"}
        )

        # Try to get only the namespaces for the association + globals
        res = self.get("/tags/namespaces/association/pdm/")
        self.assertStatusCode(res, 200)
        self.assertEqual(len(res.data["namespaces"]), 2)
        self.assertSetEqual(
            {n["name"] for n in res.data["namespaces"]}, {"farine", "users"}
        )

        # Try to get namespace forgetting the scope
        res = self.post(
            "/tags/namespaces/", {"scoped_to_model": "association", "name": "test_v"}
        )
        self.assertStatusCode(res, 403)

        res = self.post("/tags/namespaces/", {"scoped_to_pk": "pdm", "name": "test_w"})
        self.assertStatusCode(res, 403)
        # self.assertStatusCode(res, 400)

        # Try to get global namespace
        res = self.get("/tags/namespaces/?scoped_to_model=global")
        self.assertStatusCode(res, 200)
        self.assertEqual(len(res.data["results"]), 1)
        self.assertSetEqual({n["name"] for n in res.data["results"]}, {"users"})

        #######################################
        # Creation without proper authorization
        self.login("17admin_biero")
        res = self.post(
            "/tags/namespaces/",
            {"scoped_to_model": "association", "scoped_to_pk": "pdm", "name": "test_x"},
        )
        self.assertStatusCode(res, 403)

        self.login("17admin_biero")
        res = self.post(
            "/tags/namespaces/", {"scoped_to_model": "global", "name": "test_y"}
        )
        self.assertStatusCode(res, 403)

    def test_edit_namespace(self):
        ###########################
        # Create needed namespaces
        self.login("17admin")
        res = self.post(
            "/tags/namespaces/", {"scoped_to_model": "global", "name": "users"}
        )
        self.assertStatusCode(res, 201, user_msg=res.data)
        namespace_user = json.loads(res.content)

        self.login("17admin_pdm")
        res = self.post(
            "/tags/namespaces/",
            {"scoped_to_model": "association", "scoped_to_pk": "pdm", "name": "farine"},
        )
        self.assertStatusCode(res, 201)
        namespace_farine = json.loads(res.content)

        ###########################
        # Basic namespace edition

        self.login("17admin_biero")
        # Global namespace
        res = self.patch(
            "/tags/namespaces/{}/".format(namespace_user["id"]), {"name": "coucou"}
        )
        self.assertStatusCode(res, 403)

        res = self.delete("/tags/namespaces/{}/".format(namespace_user["id"]))
        self.assertStatusCode(res, 403)

        # Specific namespace that doesn't belong to us
        res = self.patch(
            "/tags/namespaces/{}/".format(namespace_farine["id"]), {"name": "coucou"}
        )
        self.assertStatusCode(res, 403)

        res = self.delete("/tags/namespaces/{}/".format(namespace_farine["id"]))
        self.assertStatusCode(res, 403)

        self.login("17admin")
        res = self.patch(
            "/tags/namespaces/{}/".format(namespace_user["id"]), {"name": "coucou"}
        )
        self.assertStatusCode(res, 200)

        self.login("17admin_pdm")
        res = self.patch(
            "/tags/namespaces/{}/".format(namespace_farine["id"]), {"name": "coucou"}
        )
        self.assertStatusCode(res, 200)

        ############################
        # Try to move the namespace
        self.login("17admin_pdm")
        res = self.patch(
            "/tags/namespaces/{}/".format(namespace_user["id"]),
            {"scoped_to_model": "global"},
        )
        self.assertStatusCode(res, 400)

        res = self.patch(
            "/tags/namespaces/{}/".format(namespace_user["id"]),
            {"scoped_to_model": "association", "scoped_to_pk": "biero"},
        )
        self.assertStatusCode(res, 400)
