from django.core.exceptions import ObjectDoesNotExist

from associations.models.association import Association
from associations.models.library import Library

from associations.tests.library.base_test_library import *


class LibraryTestCase(BaseLibraryTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_libraries(self):
        res = self.get('/library/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_libraries(self):
        self.login('17simple')
        res = self.get('/library/')
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_library(self):
        res = self.get('/library/bd-tek/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_library(self):
        self.login('17simple')
        res = self.get('/library/bd-tek/')
        self.assertStatusCode(res, 200)

    def test_if_library_disabled_then_no_access_to_library(self):
        self.login('17simple')
        res = self.get('/library/biero/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertStatusCode(res, 403)

    def test_if_library_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('/library/bde/')
        self.assertFalse(Library.objects.filter(pk='bde').exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    def test_if_not_library_admin_then_cannot_create_library(self):
        for user in ALL_USERS:
            if user != '17library_bde':
                self.login(user)
                res = self.post('/library/',
                                data={'id': 'bde', 'enabled': 'true', 'association': 'bde', 'loanables': []})
                self.assertStatusCode(res, 403)
                self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bde')

    def test_if_library_admin_then_can_create_own_library(self):
        self.login('17library_bde')  # Library administrator.
        res = self.post('/library/',
                        data={'id': 'bde', 'enabled': 'true', 'loanables': [], 'association': 'bde'})
        self.assertStatusCode(res, 201)
        self.assertTrue(Library.objects.filter(pk='bde').exists())
        self.assertEqual(Association.objects.get(pk='bde').library, Library.objects.get(pk='bde'))

    ##########
    # UPDATE #
    ##########

    def test_if_not_library_admin_then_cannot_update_library(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.patch('/library/bd-tek/', data={'enabled': 'false'})
            self.assertStatusCode(res, 403)
            self.assertTrue(Library.objects.get(pk='bd-tek').enabled)

    def test_if_library_admin_then_can_update_library(self):
        self.login('17library_bd-tek')
        res = self.patch('/library/bd-tek/', data={'enabled': 'false'})
        self.assertStatusCode(res, 200)
        self.assertFalse(Library.objects.get(pk='bd-tek').enabled)

    ##########
    # DELETE #
    ##########

    def test_if_not_library_admin_then_cannot_delete_library(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.delete('/library/bd-tek/')
            self.assertStatusCode(res, 403)
            self.assertTrue(Library.objects.filter(pk='bd-tek').exists())

    def test_if_library_admin_then_can_delete_own_library(self):
        self.login('17library_bd-tek')  # Library administrator.
        res = self.delete('/library/bd-tek/')
        self.assertStatusCode(res, 204)
        self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bd-tek')
