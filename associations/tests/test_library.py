from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from associations.tests.base_test import BaseTestCase
from associations.models.association import Association, Role
from associations.models.library import Library, Loanable, Loan


# Please see the comments on test_library.yaml to get a better understanding of the test fixtures.

class BaseLibraryTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_library.yaml']


class LibraryTestCase(BaseLibraryTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_libraries(self):
        res = self.get('library/')
        self.assertEqual(res.status_code, 401)

    def test_if_logged_in_then_access_to_libraries(self):
        self.login('17simple')
        res = self.get('library/')
        self.assertEqual(res.status_code, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_library(self):
        res = self.get('library/bd-tek/')
        self.assertEqual(res.status_code, 401)

    def test_if_logged_in_then_access_to_library(self):
        self.login('17simple')
        res = self.get('library/bd-tek/')
        self.assertEqual(res.status_code, 200)

    def test_if_library_disabled_then_no_access_to_library(self):
        self.login('17simple')
        res = self.get('library/biero/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertEqual(res.status_code, 403)

    def test_if_library_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('library/bde/')
        self.assertFalse(Library.objects.filter(pk='bde').exists())
        self.assertEqual(res.status_code, 404)

    ##########
    # CREATE #
    ##########

    def test_if_not_library_admin_then_cannot_create_library(self):
        for user in ['17simple',  # A simple user.
                     '17admin',  # A global administrator.
                     '17admin_bde']:  # An association administrator.
            self.login(user)
            res = self.post('library/', data={'id': 'bde', 'enabled': 'true', 'association': 'bde', 'loanables': []})
            self.assertEqual(res.status_code, 403)
            self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bde')

    def test_if_library_admin_then_can_create_own_library(self):
        self.login('17library_bde')  # Library administrator.
        res = self.post('library/',
                        data={'id': 'bde', 'enabled': 'true', 'loanables': [], 'association': 'bde'})
        self.assertEqual(res.status_code, 201, msg=res.content)
        self.assertTrue(Library.objects.filter(pk='bde').exists())
        self.assertEqual(Association.objects.get(pk='bde').library, Library.objects.get(pk='bde'))

    ##########
    # UPDATE #
    ##########

    def test_if_not_library_admin_then_cannot_update_library(self):
        for user in ['17simple',  # A simple user.
                     '17admin',  # A global administrator.
                     '17admin_bde']:  # An association administrator.
            self.login(user)
            res = self.patch('library/bd-tek/', data={'enabled': 'false'})
            self.assertEqual(res.status_code, 403)
            self.assertTrue(Library.objects.get(pk='bd-tek').enabled)

    def test_if_library_admin_then_can_update_library(self):
        self.login('17library_bd-tek')
        res = self.patch('library/bd-tek/', data={'enabled': 'false'})
        self.assertIn(res.status_code, [200, 204])
        self.assertFalse(Library.objects.get(pk='bd-tek').enabled)

    ##########
    # DELETE #
    ##########

    def test_if_not_library_admin_then_cannot_delete_library(self):
        for user in ['17simple',  # A simple user.
                     '17admin',  # A global administrator.
                     '17admin_bde']:  # An association administrator.
            self.login(user)
            res = self.delete('library/bd-tek/')
            self.assertEqual(res.status_code, 403)
            self.assertTrue(Library.objects.filter(pk='bd-tek').exists())

    def test_if_library_admin_then_can_delete_own_library(self):
        self.login('17library_bd-tek')  # Library administrator.
        res = self.delete('library/bd-tek/')
        self.assertEqual(res.status_code, 204)
        self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bd-tek')


class LoanableTestCase(BaseLibraryTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_loanables(self):
        res = self.get('loanables/')
        self.assertEqual(res.status_code, 401)

    def test_if_logged_in_then_access_to_loanables(self):
        self.login('17simple')
        res = self.get('loanables/')
        self.assertEqual(res.status_code, 200)

    def test_if_library_disabled_then_loanables_dont_show(self):
        self.login('17simple')
        res = self.get('loanables/')
        self.assertEqual(res.status_code, 200)
        libraries = set([x['library'] for x in res.data])
        self.assertNotIn('biero', libraries)

    def test_if_library_disabled_and_library_admin_then_loanables_show(self):
        self.login('17library_biero')
        res = self.get('loanables/')
        self.assertEqual(res.status_code, 200)
        libraries = set([x['library'] for x in res.data])
        self.assertIn('biero', libraries)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_loanable(self):
        res = self.get('loanables/1/')
        self.assertEqual(res.status_code, 401)

    def test_if_logged_in_then_access_to_loanable(self):
        self.login('17simple')
        res = self.get('loanables/3/')
        self.assertEqual(res.status_code, 200)

    def test_if_library_disabled_then_no_access_to_loanable(self):
        self.login('17simple')
        res = self.get('loanables/1/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertEqual(res.status_code, 403)

    def test_if_loanable_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('loanables/42/')
        self.assertFalse(Loanable.objects.filter(pk='42').exists())
        self.assertEqual(res.status_code, 404)

    def test_if_library_disabled_and_library_admin_then_access_to_loanable(self):
        self.login('17library_biero')
        res = self.get('loanables/1/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertEqual(res.status_code, 200)

    ##########
    # CREATE #
    ##########

    def test_if_not_library_admin_then_cannot_create_loanable(self):
        for user in ['17simple',  # A simple user.
                     '17admin',  # A global administrator.
                     '17admin_bde',  # An association administrator.
                     '17library_biero']:  # A library administrator of another association.
            self.login(user)
            data = {'name': 'La Piche', 'description': 'Manuel de la Piche',
                    'comment': 'Écrit par Léo Chabeauf', 'library': 'bd-tek'}
            res = self.post('loanables/', data=data)
            self.assertEqual(res.status_code, 403)
            self.assertRaises(ObjectDoesNotExist, Loanable.objects.get, pk=data['name'])

    def test_if_library_admin_then_can_create_loanable(self):
        self.login('17library_bd-tek')  # Library administrator.
        data = {'name': 'La Piche', 'description': 'Manuel de la Piche',
                'comment': 'Écrit par Léo Chabeauf', 'library': 'bd-tek'}
        res = self.post('loanables/', data=data)
        self.assertEqual(res.status_code, 201)
        self.assertTrue(Loanable.objects.filter(name=data['name']).exists())
        self.assertEqual(Loanable.objects.get(name=data['name']).description, data['description'])
        self.assertEqual(Loanable.objects.get(name=data['name']).comment, data['comment'])
        self.assertIn(Loanable.objects.get(name=data['name']), Library.objects.get(pk=data['library']).loanables.all())

    ##########
    # UPDATE #
    ##########

    def test_if_not_library_admin_then_cannot_update_loanable(self):
        for user in ['17simple',  # A simple user.
                     '17admin',  # A global administrator.
                     '17admin_bde',  # An association administrator.
                     '17library_biero']:  # A library administrator of another association.
            self.login(user)
            res = self.patch('loanables/3/',
                             data={'pk': 3, 'name': 'BD-laissé', 'description': 'Une BD pas très populaire…'})
            self.assertEqual(res.status_code, 403)
            self.assertEqual(Loanable.objects.get(pk=3).name, 'BD-primé')

    def test_if_library_admin_then_can_update_loanable(self):
        self.login('17library_bd-tek')
        data = {'pk': 3, 'name': 'BD-laissé', 'description': 'Une BD pas très populaire…'}
        res = self.patch('loanables/3/', data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Library.objects.get(pk=3).name, data['name'])
        self.assertEqual(Library.objects.get(pk=3).description, data['description'])

    def test_if_library_admin_and_library_disabled_then_can_update_loanable(self):
        self.login('17library_biero')
        data = {'pk': 2, 'name': 'Chaise', 'description': 'Une belle chaise en plastique orange'}
        res = self.patch('loanables/2/', data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Loanable.objects.get(pk=2).name, data['name'])
        self.assertEqual(Loanable.objects.get(pk=2).description, data['description'])

    ##########
    # DELETE #
    ##########

    def test_if_not_library_admin_then_cannot_delete_loanable(self):
        for user in ['17simple',  # A simple user.
                     '17admin',  # A global administrator.
                     '17admin_bd-tek']:  # An association administrator.
            self.login(user)
            res = self.delete('loanables/3/')
            self.assertEqual(res.status_code, 403)
            self.assertTrue(Loanable.objects.filter(pk=3).exists())

    def test_if_library_admin_then_can_delete_loanable(self):
        self.login('17library_bd-tek')  # Library administrator.
        res = self.delete('loanables/3/')
        self.assertEqual(res.status_code, 204)
        self.assertFalse(Loanable.objects.filter(pk=3).exists())


class LibraryRolesTestCase(BaseLibraryTestCase):
    def test_if_not_association_admin_then_cannot_add_library_role(self):
        for user in ['17simple',  # A simple user.
                     '17admin',  # A global administrator.
                     '17admin_bde',  # An administrator of another association.
                     '17library_bd-tek',  # A library administrator.
                     '17member_bd-tek']:  # An association member.
            self.login(user)
            self.assertFalse(Role.objects.get(pk=2).library)
            res = self.patch('roles/2/', data={'library': True})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertFalse(Role.objects.get(pk=2).library)

    def test_if_association_admin_then_can_add_library_role(self):
        self.login('17admin_bd-tek')
        self.assertFalse(Role.objects.get(pk=2).library)
        res = self.patch('roles/2/', data={'library': True})
        self.assertEqual(res.status_code, 200)
        self.assertTrue(Role.objects.get(pk=2).library)

    def test_if_not_association_admin_then_cannot_remove_library_role(self):
        for user in ['17simple',  # A simple user.
                     '17admin',  # A global administrator.
                     '17admin_bde',  # An administrator of another association.
                     '17library_bd-tek',  # A library administrator.
                     '17member_bd-tek']:  # An association member.
            self.login(user)
            self.assertTrue(Role.objects.get(pk=1).library)
            res = self.patch('roles/1/', data={'library': False})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertTrue(Role.objects.get(pk=1).library)

    def test_if_association_admin_then_can_remove_library_role(self):
        self.login('17admin_bd-tek')
        self.assertTrue(Role.objects.get(pk=1).library)
        res = self.patch('roles/1/', data={'library': False})
        self.assertEqual(res.status_code, 200)
        self.assertFalse(Role.objects.get(pk=1).library)


class LoanTestCase(BaseLibraryTestCase):
    nb_loans = {library: len(Loan.objects.filter(loanable__library=library)) for library in ['bd_tek']}

    # Can X see the loans of Y?
    #
    # || X \\ Y             | Herself | Association members | Everyone ||
    # || Simple user        | Yes     | No                  | No       ||
    # || Association member | Yes     | No                  | No       ||
    # || Library admin      | Yes     | Yes                 | No       ||
    # || Association admin  | Yes     | No                  | No       ||
    # || Global admin       | Yes     | No                  | No       ||

    def assertCanListLoans(self, loans, code=200, user=''):
        """Fail if the loans listed at "loans/" do not contain the loans passed as a parameter."""

        res = self.get('loans/')
        self.assertEqual(res.status_code, code)

        res_ids = set([loan['id'] for loan in res.data])
        for loan in loans:
            self.assertIn(loan.id, res_ids, msg=f'User {user} cannot list loan {loan.id}.')

    def assertCanOnlyListLoans(self, loans, code=200, user=''):
        """Fail if the loans listed at "loans/" are not exactly the loans passed as a parameter."""

        res = self.get('loans/')
        self.assertEqual(res.status_code, code)

        res_ids = set([loan['id'] for loan in res.data])
        expected_ids = set([loan.id for loan in loans])
        self.assertEqual(res_ids, expected_ids, msg=f'User {user}: expected list {expected_ids}, got list {res_ids}.')

    def assertAccessToLoan(self, loan_id, code=200, user=''):
        """Fail if access is not given to loan loan_id."""

        res = self.get(f'loans/{loan_id}/')
        self.assertEqual(res.status_code, code, msg=f'User {user} cannot access loan {loan_id}.')

    def assertNoAccessToLoan(self, loan_id, code=403, user=''):
        """Fail if access is given to loan loan_id."""

        res = self.get(f'loans/{loan_id}/')
        self.assertEqual(res.status_code, code, msg=f'User {user} can access loan {loan_id}.')

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_loans(self):
        res = self.get('loans/')
        self.assertEqual(res.status_code, 401)

    def test_if_user_then_access_to_own_loans(self):
        for user in ['17simple',
                     '17member_bd-tek',
                     '17admin_bd-tek',
                     '17library_biero',
                     '17admin']:
            self.login(user)
            self.assertCanOnlyListLoans(Loan.objects.filter(user=user), 200, user)

    def test_if_not_library_admin_then_only_access_to_own_loans(self):
        for user in ['17simple',
                     '17member_bd-tek',
                     '17admin_bd-tek',
                     '17library_biero',
                     '17admin']:
            self.login(user)
            self.assertCanOnlyListLoans(Loan.objects.filter(user=user), 200, user)

    def test_if_library_admin_then_only_access_to_association_loans_and_own_loans(self):
        user = '17library_bd-tek'
        loans = Loan.objects.filter(Q(user=user) | Q(loanable__library='bd-tek'))
        self.assertCanOnlyListLoans(loans, 200, user)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_loan(self):
        self.assertNoAccessToLoan(0, 401)

    def test_if_user_then_access_to_own_loan(self):
        for user in ['17simple',
                     '17member_bd-tek',
                     '17library_bd-tek',
                     '17admin_bd-tek',
                     '17admin']:
            self.login(user)

            for loan in Loan.objects.filter(user=user):
                self.assertAccessToLoan(loan.id, code=200, user=user)

    def test_if_not_library_admin_then_only_access_to_own_loan(self):
        for user in ['17simple',
                     '17member_bd-tek',
                     '17admin_bd-tek',
                     '17library_biero',
                     '17admin']:
            self.login(user)

            for loan in Loan.objects.all():
                if loan.user == user:
                    self.assertAccessToLoan(loan.id, code=200, user=user)
                else:
                    self.assertNoAccessToLoan(loan.id, code=403, user=user)

    def test_if_library_admin_then_only_access_to_own_loan_and_association_loan(self):
        user = '17library_bd-tek'
        self.login(user)

        for loan in Loan.objects.all():
            if loan.user == user or loan.loanable.library == 'bd-tek':
                self.assertAccessToLoan(loan.id, 200, user=user)
            else:
                self.assertNoAccessToLoan(loan.id, 403, user=user)

    def test_if_loan_does_not_exist_then_404(self):
        self.login('17simple')
        self.assertNoAccessToLoan(42, 404)
