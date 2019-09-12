from django.core.exceptions import ObjectDoesNotExist

from associations.models.library import Library, Loanable
from associations.tests.library.base_test_library import *


class LoanableTestCase(BaseLibraryTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_loanables(self):
        res = self.get('loanables/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_loanables(self):
        self.login('17simple')
        res = self.get('loanables/')
        self.assertStatusCode(res, 200)

    def test_if_library_disabled_then_loanables_dont_show(self):
        self.login('17simple')
        res = self.get('loanables/')
        self.assertStatusCode(res, 200)
        libraries = set([x['library'] for x in res.data])
        self.assertNotIn('biero', libraries)

    def test_if_library_disabled_and_library_admin_then_loanables_show(self):
        self.login('17library_biero')
        res = self.get('loanables/')
        self.assertStatusCode(res, 200)
        libraries = set([x['library'] for x in res.data])
        self.assertIn('biero', libraries)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_loanable(self):
        res = self.get('loanables/1/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_loanable(self):
        self.login('17simple')
        res = self.get('loanables/3/')
        self.assertStatusCode(res, 200)

    def test_if_library_disabled_then_no_access_to_loanable(self):
        self.login('17simple')
        res = self.get('loanables/1/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertStatusCode(res, 403)

    def test_if_loanable_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('loanables/42/')
        self.assertFalse(Loanable.objects.filter(pk='42').exists())
        self.assertStatusCode(res, 404)

    def test_if_library_disabled_and_library_admin_then_access_to_loanable(self):
        self.login('17library_biero')
        res = self.get('loanables/1/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertStatusCode(res, 200)

    ##########
    # CREATE #
    ##########

    def test_if_not_library_admin_then_cannot_create_loanable(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            data = {'name': 'La Piche', 'description': 'Manuel de la Piche',
                    'comment': 'Écrit par Léo Chabeauf', 'library': 'bd-tek'}
            res = self.post('loanables/', data=data)
            self.assertStatusCode(res, 403)
            self.assertRaises(ObjectDoesNotExist, Loanable.objects.get, name=data['name'])

    def test_if_library_admin_then_can_create_loanable(self):
        self.login('17library_bd-tek')  # Library administrator.
        data = {'name': 'La Piche', 'description': 'Manuel de la Piche',
                'comment': 'Écrit par Léo Chabeauf', 'library': 'bd-tek'}
        res = self.post('loanables/', data=data)
        self.assertStatusCode(res, 201)
        self.assertTrue(Loanable.objects.filter(name=data['name']).exists())
        self.assertEqual(Loanable.objects.get(name=data['name']).description, data['description'])
        self.assertEqual(Loanable.objects.get(name=data['name']).comment, data['comment'])
        self.assertIn(Loanable.objects.get(name=data['name']), Library.objects.get(pk=data['library']).loanables.all())

    ##########
    # UPDATE #
    ##########

    def test_if_not_library_admin_then_cannot_update_loanable(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.patch('loanables/3/',
                             data={'pk': 3, 'name': 'BD-laissé', 'description': 'Une BD pas très populaire…'})
            self.assertStatusCode(res, 403)
            self.assertEqual(Loanable.objects.get(pk=3).name, 'BD-primé')

    def test_if_library_admin_then_can_update_loanable(self):
        self.login('17library_bd-tek')
        data = {'pk': 3, 'name': 'BD-laissé', 'description': 'Une BD pas très populaire…'}
        res = self.patch('loanables/3/', data)
        self.assertStatusCode(res, 200)
        self.assertEqual(Loanable.objects.get(pk=3).name, data['name'])
        self.assertEqual(Loanable.objects.get(pk=3).description, data['description'])

    def test_if_library_admin_and_library_disabled_then_can_update_loanable(self):
        self.login('17library_biero')
        data = {'pk': 2, 'name': 'Chaise', 'description': 'Une belle chaise en plastique orange'}
        res = self.patch('loanables/2/', data)
        self.assertStatusCode(res, 200)
        self.assertEqual(Loanable.objects.get(pk=2).name, data['name'])
        self.assertEqual(Loanable.objects.get(pk=2).description, data['description'])

    ##########
    # DELETE #
    ##########

    def test_if_not_library_admin_then_cannot_delete_loanable(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.delete('loanables/3/', '')
            self.assertStatusCode(res, 403)
            self.assertTrue(Loanable.objects.filter(pk=3).exists())

    def test_if_library_admin_then_can_delete_loanable(self):
        self.login('17library_bd-tek')  # Library administrator.
        res = self.delete('loanables/3/', '')
        self.assertStatusCode(res, 204)
        self.assertFalse(Loanable.objects.filter(pk=3).exists())
