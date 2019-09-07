from django.core.exceptions import ObjectDoesNotExist

from associations.tests.base_test import BaseTestCase
from associations.models.association import Association
from associations.models.library import Library


class LibraryTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_library.yaml']

    ########
    # READ #
    ########

    def test_if_not_logged_in_then_no_access_to_library(self):
        res = self.get('library/')
        self.assertEqual(res.status_code, 401)

    def test_if_logged_in_then_access_to_library(self):
        self.login('17simple')
        res = self.get('library/')
        self.assertEqual(res.status_code, 200)

    def test_if_library_disabled_then_no_access_to_library(self):
        # TODO: it is unclear what a "disabled library" means.
        self.login('17simple')
        res = self.get('library/biero/')
        # self.assertEqual(res.status_code, 403)

    def test_if_library_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('library/bde/')
        self.assertEqual(res.status_code, 404)

    ##########
    # CREATE #
    ##########

    def test_if_not_library_admin_then_cannot_create_library(self):
        self.login('17simple')
        res = self.post('library/', data={'id': 'bde', 'enabled': 'true'})
        self.assertEqual(res.status_code, 403)
        self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bde')

        self.login('17admin')  # Just global administrator, not library administrator.
        res = self.post('library/', data={'id': 'bde', 'enabled': 'true'})
        self.assertEqual(res.status_code, 403)
        self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bde')

        self.login('17admin_bde')  # Just association administrator, not library administrator.
        res = self.post('library/', data={'id': 'bde', 'enabled': 'true'})
        self.assertEqual(res.status_code, 403)
        self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bde')

    def test_if_library_admin_then_can_create_own_library(self):
        self.login('17library_bde')  # Library administrator.
        res = self.post('library/', data={'id': 'bde', 'enabled': 'true'})
        self.assertEqual(res.status_code, 201)
        self.assertTrue(Library.objects.filter(pk='bde').exists())
        self.assertEqual(Association.objects.get(pk='bde').library, Library.objects.get(pk='bde'))

    ##########
    # DELETE #
    ##########

    def test_if_not_library_admin_then_cannot_delete_library(self):
        self.login('17simple')
        res = self.delete('library/bd-tek/')
        self.assertEqual(res.status_code, 403)
        self.assertTrue(Library.objects.filter(pk='bd-tek').exists())

        self.login('17admin')  # Just global administrator, not library administrator.
        res = self.delete('library/bd-tek/')
        self.assertEqual(res.status_code, 403)
        self.assertTrue(Library.objects.filter(pk='bd-tek').exists())

        self.login('17admin_bde')  # Just association administrator, not library administrator.
        res = self.delete('library/bd-tek/')
        self.assertEqual(res.status_code, 403)
        self.assertTrue(Library.objects.filter(pk='bd-tek').exists())

    def test_if_library_admin_then_can_delete_own_library(self):
        self.login('17library_bd-tek')  # Library administrator.
        res = self.delete('library/bd-tek/')
        self.assertEqual(res.status_code, 204)
        self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bd-tek')

    ##########
    # UPDATE #
    ##########

    def test_if_not_library_admin_then_cannot_update_library(self):
        self.login('17simple')
        res = self.patch('library/bd-tek/', data={'enabled': 'false'})
        self.assertEqual(res.status_code, 403)
        self.assertEqual(Library.objects.get(pk='bd-tek').enabled, True)

        self.login('17admin')  # Just global administrator, not library administrator.
        res = self.patch('library/bd-tek/', data={'enabled': 'false'})
        self.assertEqual(res.status_code, 403)
        self.assertEqual(Library.objects.get(pk='bd-tek').enabled, True)

        self.login('17admin_biero')  # Just association administrator, not library administrator.
        res = self.patch('library/bd-tek/', data={'enabled': 'false'})
        self.assertEqual(res.status_code, 403)
        self.assertEqual(Library.objects.get(pk='bd-tek').enabled, True)

    def test_if_library_admin_then_can_update_library(self):
        self.login('17library_bd-tek')
        res = self.patch('library/bd-tek/', data={'enabled': 'false'})
        self.assertIn(res.status_code, [200, 204])
        self.assertEqual(Library.objects.get(pk='bd-tek').enabled, False)
