from associations.tests.base_test import BaseTestCase
from tags.models import Namespace


class TagNamespaceTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_marketplace.yaml']

    def test_create_scoped_namespace(self):
        ##############################
        # Creation of global namespace

        self.login("17admin")
        res = self.post('/tags/namespaces/', {
            'scope': "global",
            'name': 'users'
        })
        self.assertStatusCode(res, 201)

        # Check cannot create two global namespaces with the same name
        res = self.post('/tags/namespaces/', {
            'scope': "global",
            'name': 'users'
        })

        self.assertStatusCode(res, 400)

        ############################################
        # Creation of a namespace for an association

        self.login("17admin_pdm")
        res = self.post('/tags/namespaces/', {
            'scope': "association",
            'scoped_to': 'pdm',
            'name': 'farine'
        })
        self.assertStatusCode(res, 201)

        # Try to get all namespaces
        res = self.get('/tags/namespaces/')
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res.content, [
            {"id": 1, "name": "users", "scope": "global"},
            {"id": 2, "name": "farine", "scope": "association", "scoped_to": "pdm"}
        ])

        # Try to get only the namespaces for the association
        res = self.get('/tags/namespaces/?scope=association&scoped_to=pdm')
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res.content, [
            {"id": 2, "name": "farine", "scope": "association", "scoped_to": "pdm"}
        ])

        # Try to get namespace forgetting the scope
        res = self.post('/tags/namespaces/', {
            'scope': 'association',
            'name': 'test_v'
        })
        self.assertStatusCode(res, 400)

        res = self.post('/tags/namespaces/', {
            "scoped_to": 'pdm',
            'name': 'test_w'
        })
        self.assertStatusCode(res, 400)

        # Try to get global namespace
        res = self.get('/tags/namespaces/?scope=global')
        self.assertStatusCode(res, 200)
        self.assertJSONEqual(res.content, [
            {"id": 1, "name": "users", "scope": "global"},
        ])

        #######################################
        # Creation without proper authorization
        self.login("17admin_biero")
        res = self.post('/tags/namespaces/', {
            'scope': "association",
            'scoped_to': 'pdm',
            'name': 'test_x'
        })
        self.assertStatusCode(res, 403)

        self.login("17admin_biero")
        res = self.post('/tags/namespaces/', {
            'scope': "global",
            'name': 'test_y'
        })
        self.assertStatusCode(res, 403)
