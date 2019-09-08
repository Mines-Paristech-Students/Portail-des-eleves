from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from associations.tests.base_test import BaseTestCase
from associations.models.association import Association, Role
from associations.models.library import Library, Loanable, Loan

# Please see the comments on test_library.yaml to get a better understanding of the test fixtures.
# TODO: test which fields are serialized.

ALL_USERS = ['17simple', '17member_bd-tek', '17library_bd-tek', '17admin_bd-tek', '17library_biero', '17admin']
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_LIBRARY_BD_TEK = [user for user in ALL_USERS if user != '17library_bd-tek']
"""Same as ALL_USERS, but with 17library_bd-tek removed."""

ALL_USERS_EXCEPT_ADMIN_BD_TEK = [user for user in ALL_USERS if user != '17admin_bd-tek']
"""Same as ALL_USERS, but with 17admin_bd-tek removed."""


class BaseLibraryTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_library.yaml']


class LibraryTestCase(BaseLibraryTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_libraries(self):
        res = self.get('library/')
        self.assertEqual(res.status_code, 401, msg=res.content)

    def test_if_logged_in_then_access_to_libraries(self):
        self.login('17simple')
        res = self.get('library/')
        self.assertEqual(res.status_code, 200, msg=res.content)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_library(self):
        res = self.get('library/bd-tek/')
        self.assertEqual(res.status_code, 401, msg=res.content)

    def test_if_logged_in_then_access_to_library(self):
        self.login('17simple')
        res = self.get('library/bd-tek/')
        self.assertEqual(res.status_code, 200, msg=res.content)

    def test_if_library_disabled_then_no_access_to_library(self):
        self.login('17simple')
        res = self.get('library/biero/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertEqual(res.status_code, 403, msg=res.content)

    def test_if_library_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('library/bde/')
        self.assertFalse(Library.objects.filter(pk='bde').exists())
        self.assertEqual(res.status_code, 404, msg=res.content)

    ##########
    # CREATE #
    ##########

    def test_if_not_library_admin_then_cannot_create_library(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.post('library/', data={'id': 'bde', 'enabled': 'true', 'association': 'bde', 'loanables': []})
            self.assertEqual(res.status_code, 403, msg=res.content)
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
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.patch('library/bd-tek/', data={'enabled': 'false'})
            self.assertEqual(res.status_code, 403, msg=res.content)
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
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.delete('library/bd-tek/')
            self.assertEqual(res.status_code, 403, msg=res.content)
            self.assertTrue(Library.objects.filter(pk='bd-tek').exists())

    def test_if_library_admin_then_can_delete_own_library(self):
        self.login('17library_bd-tek')  # Library administrator.
        res = self.delete('library/bd-tek/')
        self.assertEqual(res.status_code, 204, msg=res.content)
        self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bd-tek')


class LoanableTestCase(BaseLibraryTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_loanables(self):
        res = self.get('loanables/')
        self.assertEqual(res.status_code, 401, msg=res.content)

    def test_if_logged_in_then_access_to_loanables(self):
        self.login('17simple')
        res = self.get('loanables/')
        self.assertEqual(res.status_code, 200, msg=res.content)

    def test_if_library_disabled_then_loanables_dont_show(self):
        self.login('17simple')
        res = self.get('loanables/')
        self.assertEqual(res.status_code, 200, msg=res.content)
        libraries = set([x['library'] for x in res.data])
        self.assertNotIn('biero', libraries)

    def test_if_library_disabled_and_library_admin_then_loanables_show(self):
        self.login('17library_biero')
        res = self.get('loanables/')
        self.assertEqual(res.status_code, 200, msg=res.content)
        libraries = set([x['library'] for x in res.data])
        self.assertIn('biero', libraries)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_loanable(self):
        res = self.get('loanables/1/')
        self.assertEqual(res.status_code, 401, msg=res.content)

    def test_if_logged_in_then_access_to_loanable(self):
        self.login('17simple')
        res = self.get('loanables/3/')
        self.assertEqual(res.status_code, 200, msg=res.content)

    def test_if_library_disabled_then_no_access_to_loanable(self):
        self.login('17simple')
        res = self.get('loanables/1/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertEqual(res.status_code, 403, msg=res.content)

    def test_if_loanable_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('loanables/42/')
        self.assertFalse(Loanable.objects.filter(pk='42').exists())
        self.assertEqual(res.status_code, 404, msg=res.content)

    def test_if_library_disabled_and_library_admin_then_access_to_loanable(self):
        self.login('17library_biero')
        res = self.get('loanables/1/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertEqual(res.status_code, 200, msg=res.content)

    ##########
    # CREATE #
    ##########

    def test_if_not_library_admin_then_cannot_create_loanable(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            data = {'name': 'La Piche', 'description': 'Manuel de la Piche',
                    'comment': 'Écrit par Léo Chabeauf', 'library': 'bd-tek'}
            res = self.post('loanables/', data=data)
            self.assertEqual(res.status_code, 403, msg=res.content)
            self.assertRaises(ObjectDoesNotExist, Loanable.objects.get, pk=data['name'])

    def test_if_library_admin_then_can_create_loanable(self):
        self.login('17library_bd-tek')  # Library administrator.
        data = {'name': 'La Piche', 'description': 'Manuel de la Piche',
                'comment': 'Écrit par Léo Chabeauf', 'library': 'bd-tek'}
        res = self.post('loanables/', data=data)
        self.assertEqual(res.status_code, 201, msg=res.content)
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
            self.assertEqual(res.status_code, 403, msg=res.content)
            self.assertEqual(Loanable.objects.get(pk=3).name, 'BD-primé')

    def test_if_library_admin_then_can_update_loanable(self):
        self.login('17library_bd-tek')
        data = {'pk': 3, 'name': 'BD-laissé', 'description': 'Une BD pas très populaire…'}
        res = self.patch('loanables/3/', data)
        self.assertEqual(res.status_code, 200, msg=res.content)
        self.assertEqual(Library.objects.get(pk=3).name, data['name'])
        self.assertEqual(Library.objects.get(pk=3).description, data['description'])

    def test_if_library_admin_and_library_disabled_then_can_update_loanable(self):
        self.login('17library_biero')
        data = {'pk': 2, 'name': 'Chaise', 'description': 'Une belle chaise en plastique orange'}
        res = self.patch('loanables/2/', data)
        self.assertEqual(res.status_code, 200, msg=res.content)
        self.assertEqual(Loanable.objects.get(pk=2).name, data['name'])
        self.assertEqual(Loanable.objects.get(pk=2).description, data['description'])

    ##########
    # DELETE #
    ##########

    def test_if_not_library_admin_then_cannot_delete_loanable(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.delete('loanables/3/')
            self.assertEqual(res.status_code, 403, msg=res.content)
            self.assertTrue(Loanable.objects.filter(pk=3).exists())

    def test_if_library_admin_then_can_delete_loanable(self):
        self.login('17library_bd-tek')  # Library administrator.
        res = self.delete('loanables/3/')
        self.assertEqual(res.status_code, 204, msg=res.content)
        self.assertFalse(Loanable.objects.filter(pk=3).exists())


class LibraryRolesTestCase(BaseLibraryTestCase):
    def test_if_not_association_admin_then_cannot_add_library_role(self):
        for user in ALL_USERS_EXCEPT_ADMIN_BD_TEK:
            self.login(user)
            self.assertFalse(Role.objects.get(pk=2).library)
            res = self.patch('roles/2/', data={'library': True})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertFalse(Role.objects.get(pk=2).library)

    def test_if_association_admin_then_can_add_library_role(self):
        self.login('17admin_bd-tek')
        self.assertFalse(Role.objects.get(pk=2).library)
        res = self.patch('roles/2/', data={'library': True})
        self.assertEqual(res.status_code, 200, msg=res.content)
        self.assertTrue(Role.objects.get(pk=2).library)

    def test_if_not_association_admin_then_cannot_remove_library_role(self):
        for user in ALL_USERS_EXCEPT_ADMIN_BD_TEK:
            self.login(user)
            self.assertTrue(Role.objects.get(pk=1).library)
            res = self.patch('roles/1/', data={'library': False})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertTrue(Role.objects.get(pk=1).library)

    def test_if_association_admin_then_can_remove_library_role(self):
        self.login('17admin_bd-tek')
        self.assertTrue(Role.objects.get(pk=1).library)
        res = self.patch('roles/1/', data={'library': False})
        self.assertEqual(res.status_code, 200, msg=res.content)
        self.assertFalse(Role.objects.get(pk=1).library)


class LoanTestCase(BaseLibraryTestCase):
    nb_loans = {library: len(Loan.objects.filter(loanable__library=library)) for library in ['bd_tek']}

    #################
    # GLOBAL POLICY #
    #################

    # LIST & RETRIEVE
    # Can X see the loans of Y?
    #
    # || X \\ Y             | Herself | Association members | Everyone ||
    # || Simple user        | Yes     | No                  | No       ||
    # || Association member | Yes     | No                  | No       ||
    # || Library admin      | Yes     | Yes                 | No       ||
    # || Association admin  | Yes     | No                  | No       ||
    # || Global admin       | Yes     | No                  | No       ||
    #
    #
    # CREATE
    # An user must ONLY provide the loanable field in the request. Any extra field will result in a 403.
    # The only exception to this rule concerns the library administrators, who can provide any fields they want.

    ########
    # LIST #
    ########

    def assertCanListTheseLoans(self, loans, code=200, user=''):
        """Fail if the loans listed at "loans/" do not contain the loans passed as a parameter."""

        res = self.get('loans/')
        self.assertEqual(res.status_code, code)

        res_ids = set([loan['id'] for loan in res.data])
        for loan in loans:
            self.assertIn(loan.id, res_ids, msg=f'User {user} cannot list loan {loan.id}.')

    def assertCanOnlyListTheseLoans(self, loans, code=200, user=''):
        """Fail if the loans listed at "loans/" are not exactly the loans passed as a parameter."""

        res = self.get('loans/')
        self.assertEqual(res.status_code, code)

        res_ids = set([loan['id'] for loan in res.data])
        expected_ids = set([loan.id for loan in loans])
        self.assertEqual(res_ids, expected_ids, msg=f'User {user}: expected list {expected_ids}, got list {res_ids}.')

    def test_if_not_logged_in_then_no_access_to_loans(self):
        res = self.get('loans/')
        self.assertEqual(res.status_code, 401, msg=res.content)

    def test_if_user_then_access_to_own_loans(self):
        for user in ALL_USERS:
            self.login(user)
            self.assertCanOnlyListTheseLoans(Loan.objects.filter(user=user), 200, user)

    def test_if_not_library_admin_then_only_access_to_own_loans(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            self.assertCanOnlyListTheseLoans(Loan.objects.filter(user=user), 200, user)

    def test_if_library_admin_then_only_access_to_association_loans_and_own_loans(self):
        user = '17library_bd-tek'
        loans = Loan.objects.filter(Q(user=user) | Q(loanable__library='bd-tek'))
        self.assertCanOnlyListTheseLoans(loans, 200, user)

    ############
    # RETRIEVE #
    ############

    def assertAccessToLoan(self, loan_id, code=200, user=''):
        """Fail if access is not given to loan loan_id."""

        res = self.get(f'loans/{loan_id}/')
        self.assertEqual(res.status_code, code, msg=f'User {user} cannot access loan {loan_id}.')

    def assertNoAccessToLoan(self, loan_id, code=403, user=''):
        """Fail if access is given to loan loan_id."""

        res = self.get(f'loans/{loan_id}/')
        self.assertEqual(res.status_code, code, msg=f'User {user} can access loan {loan_id}.')

    def test_if_not_logged_in_then_no_access_to_loan(self):
        self.assertNoAccessToLoan(0, 401)

    def test_if_user_then_access_to_own_loan(self):
        for user in ALL_USERS:
            self.login(user)

            for loan in Loan.objects.filter(user=user):
                self.assertAccessToLoan(loan.id, code=200, user=user)

    def test_if_not_library_admin_then_only_access_to_own_loan(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
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

    ##########
    # CREATE #
    ##########

    def assertCanCreateLoan(self, user, data, code=201):
        self.login(user)
        length_before = len(Loan.objects.all())
        res = self.post('loans/', data=data)
        self.assertEqual(res.status_code, code)
        self.assertEqual(length_before + 1, len(Loan.objects.all()), f'User {user} did not manage to insert {data}.')

    def assertCannotCreateLoan(self, user, data, code=403):
        self.login(user)
        length_before = len(Loan.objects.all())
        res = self.post('loans/', data=data)
        self.assertEqual(res.status_code, code)
        self.assertEqual(length_before, len(Loan.objects.all()), f'User {user} managed to insert {data}.')

    def test_if_library_enabled_then_can_create_loan(self):
        loanable_id = 3
        self.assertTrue(Loanable.objects.get(pk=loanable_id).library.enabled,
                        f'Test premise is wrong: library of loanable {loanable_id} is not enabled')

        for user in ALL_USERS:
            self.assertCanCreateLoan(user, data={'loanable': loanable_id}, code=201)

    def test_verify_loan_entry_if_not_library_administrator(self):
        """
        When a loan is created:\n
        * the id is set automatically;\n
        * the loanable and user fields are set to the required value;\n
        * the status is set to PENDING;\n
        * the dates are set to None.
        """
        loanable_id = 3
        self.assertTrue(Loanable.objects.get(pk=loanable_id).library.enabled,
                        f'Test premise is wrong: library of loanable {loanable_id} is not enabled')

        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.post('loans/', data={'loanable': loanable_id})
            
            self.assertEqual(res.status_code, 201, msg=res.content)
            last_loan = Loan.objects.order_by(-Loan.id)[0]
            self.assertEqual(last_loan.loanable_id, loanable_id)
            self.assertEqual(last_loan.user, user)
            self.assertEqual(last_loan.status, 'PENDING')
            self.assertEqual(last_loan.loan_date, None)
            self.assertEqual(last_loan.expected_return_date, None)
            self.assertEqual(last_loan.real_return_date, None)

    def test_if_library_disabled_then_cannot_create_loan(self):
        loanable_id = 1
        self.assertFalse(Loanable.objects.get(pk=loanable_id).library.enabled,
                         f'Test premise is wrong: library of loanable {loanable_id} is not disabled')

        for user in ALL_USERS:
            self.assertCannotCreateLoan(user, data={'loanable': loanable_id})

    def test_if_not_library_administrator_then_cannot_create_loan_for_another_user(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            if user != '17wan-fat':
                self.assertCannotCreateLoan(user, data={'loanable': 3, user: '17wan-fat'})

    def test_if_not_library_administrator_then_cannot_create_loan_with_not_pending_status(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.assertCannotCreateLoan(user, data={'loanable': 3, 'status': 'BORROWED'})

    def test_if_not_library_administrator_then_cannot_create_loan_with_date(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.assertCannotCreateLoan(user, data={'loanable': 3,
                                                    'loan_date': '2018-03-11T00:00:00+00:00',
                                                    'expected_return_date': '2018-03-11T00:00:00+00:00',
                                                    'real_return_date': '2018-03-11T00:00:00+00:00'})

    def test_if_not_library_administrator_and_loanable_already_borrowed_then_cannot_create_loan(self):
        loanable_id = 4
        self.assertTrue(Loanable.objects.get(pk=loanable_id).is_borrowed(),
                        f'Test premise is wrong: loanable {loanable_id} is not borrowed.')

        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.assertCannotCreateLoan(user, data={'loanable': loanable_id})

##########
# UPDATE #
##########

##########
# DELETE #
##########
