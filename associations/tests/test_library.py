from datetime import datetime, timedelta, timezone

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q

from associations.tests.base_test import BaseTestCase
from associations.models.association import Association, Role
from associations.models.library import Library, Loanable, Loan
from authentication.models.user import User

# Please see the comments on test_library.yaml to get a better understanding of the test fixtures.
# TODO: test which fields are serialized.

ALL_USERS = ['17simple', '17member_bd-tek', '17library_bd-tek', '17admin_bd-tek', '17library_biero', '17admin']
"""A list of user ids covering all the spectrum of roles and permissions."""

ALL_USERS_EXCEPT_LIBRARY_BD_TEK = [user for user in ALL_USERS if user != '17library_bd-tek']
"""Same as ALL_USERS, but with 17library_bd-tek removed."""

ALL_USERS_EXCEPT_LIBRARY_BIERO = [user for user in ALL_USERS if user != '17library_biero']
"""Same as ALL_USERS, but with 17library_biero removed."""

ALL_USERS_EXCEPT_ADMIN_BD_TEK = [user for user in ALL_USERS if user != '17admin_bd-tek']
"""Same as ALL_USERS, but with 17admin_bd-tek removed."""

ALL_USERS_EXCEPT_LIBRARY_ADMIN = [user for user in ALL_USERS if 'library' not in user]
"""Same as ALL_USERS, but with all the library administrators removed."""


class BaseLibraryTestCase(BaseTestCase):
    fixtures = ['test_authentication.yaml', 'test_library.yaml']


class LibraryTestCase(BaseLibraryTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_libraries(self):
        res = self.get('library/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_libraries(self):
        self.login('17simple')
        res = self.get('library/')
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_no_access_to_library(self):
        res = self.get('library/bd-tek/')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_library(self):
        self.login('17simple')
        res = self.get('library/bd-tek/')
        self.assertStatusCode(res, 200)

    def test_if_library_disabled_then_no_access_to_library(self):
        self.login('17simple')
        res = self.get('library/biero/')
        self.assertFalse(Library.objects.get(pk='biero').enabled)
        self.assertStatusCode(res, 403)

    def test_if_library_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.get('library/bde/')
        self.assertFalse(Library.objects.filter(pk='bde').exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    def test_if_not_library_admin_then_cannot_create_library(self):
        for user in ALL_USERS:
            if user != '17library_bde':
                self.login(user)
                res = self.post('library/',
                                data={'id': 'bde', 'enabled': 'true', 'association': 'bde', 'loanables': []})
                self.assertStatusCode(res, 403)
                self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bde')

    def test_if_library_admin_then_can_create_own_library(self):
        self.login('17library_bde')  # Library administrator.
        res = self.post('library/',
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
            res = self.patch('library/bd-tek/', data={'enabled': 'false'})
            self.assertStatusCode(res, 403)
            self.assertTrue(Library.objects.get(pk='bd-tek').enabled)

    def test_if_library_admin_then_can_update_library(self):
        self.login('17library_bd-tek')
        res = self.patch('library/bd-tek/', data={'enabled': 'false'})
        self.assertStatusCode(res, 200)
        self.assertFalse(Library.objects.get(pk='bd-tek').enabled)

    ##########
    # DELETE #
    ##########

    def test_if_not_library_admin_then_cannot_delete_library(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.login(user)
            res = self.delete('library/bd-tek/', '')
            self.assertStatusCode(res, 403)
            self.assertTrue(Library.objects.filter(pk='bd-tek').exists())

    def test_if_library_admin_then_can_delete_own_library(self):
        self.login('17library_bd-tek')  # Library administrator.
        res = self.delete('library/bd-tek/', '')
        self.assertStatusCode(res, 204)
        self.assertRaises(ObjectDoesNotExist, Library.objects.get, pk='bd-tek')


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


class LibraryRolesTestCase(BaseLibraryTestCase):
    def test_if_not_association_admin_then_cannot_add_library_role(self):
        for user in ALL_USERS_EXCEPT_ADMIN_BD_TEK:
            self.login(user)
            self.assertFalse(Role.objects.get(pk=2).library)
            res = self.patch('roles/2/', data={'library': True})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertFalse(Role.objects.get(pk=2).library)

    def test_if_association_admin_then_can_add_library_role(self):
        user = '17admin_bd-tek'
        self.login(user)
        self.assertTrue(User.objects.get(pk=user).get_role(Association.objects.get(pk='bd-tek')).is_admin)

        self.assertFalse(Role.objects.get(pk=2).library)
        res = self.patch('roles/2/', data={'library': True})
        self.assertStatusCode(res, 200)
        self.assertTrue(Role.objects.get(pk=2).library)

    def test_if_not_association_admin_then_cannot_remove_library_role(self):
        for user in ALL_USERS_EXCEPT_ADMIN_BD_TEK:
            self.login(user)
            res = self.patch('roles/1/', data={'library': False})
            self.assertEqual(res.status_code, 403, msg=f'{user} did not get a 403.')
            self.assertTrue(Role.objects.get(pk=1).library)

    def test_if_association_admin_then_can_remove_library_role(self):
        self.login('17admin_bd-tek')
        self.assertTrue(Role.objects.get(pk=1).library)
        res = self.patch('roles/1/', data={'library': False})
        self.assertStatusCode(res, 200)
        self.assertFalse(Role.objects.get(pk=1).library)


class LoanTestCase(BaseLibraryTestCase):
    NB_LOANS = {library: len(Loan.objects.filter(loanable__library=library)) for library in ['bd_tek']}

    # Please see the diagram in associations.models.library.Loan.
    STATUS_COUPLES = [
        ('PENDING', 'CANCELLED'),
        ('PENDING', 'ACCEPTED'),
        ('PENDING', 'REJECTED'),
        ('CANCELLED', 'PENDING'),
        ('ACCEPTED', 'PENDING'),
        ('REJECTED', 'PENDING'),
        ('ACCEPTED', 'BORROWED'),
        ('BORROWED', 'ACCEPTED'),
        ('BORROWED', 'RETURNED'),
        ('RETURNED', 'BORROWED'),
    ]

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
        self.login(user)
        res = self.get('loans/')
        self.assertEqual(res.status_code, code)

        res_ids = set([loan['id'] for loan in res.data])
        for loan in loans:
            self.assertIn(loan.id, res_ids, msg=f'User {user} cannot list loan {loan.id}.')

    def assertCanOnlyListTheseLoans(self, loans, code=200, user=''):
        """Fail if the loans listed at "loans/" are not exactly the loans passed as a parameter."""

        self.login(user)
        res = self.get('loans/')
        self.assertEqual(res.status_code, code)

        res_ids = set([loan['id'] for loan in res.data])
        expected_ids = set([loan.id for loan in loans])
        self.assertEqual(res_ids, expected_ids, msg=f'User {user}: expected list {expected_ids}, got list {res_ids}.')

    def test_if_not_logged_in_then_no_access_to_loans(self):
        res = self.get('loans/')
        self.assertStatusCode(res, 401)

    def test_if_user_then_access_to_own_loans_in_enabled_libraries(self):
        for user in ALL_USERS:
            self.assertCanListTheseLoans(Loan.objects.filter(user=user, loanable__library__enabled=True), 200,
                                         user)

    def test_if_not_library_admin_then_only_access_to_own_loans(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_ADMIN:
            self.assertCanOnlyListTheseLoans(Loan.objects.filter(user=user, loanable__library__enabled=True), 200, user)

    def test_if_library_admin_then_only_access_to_association_loans_and_own_loans(self):
        user = '17library_bd-tek'
        self.login(user)
        loans = Loan.objects.filter((Q(user__id=user) & Q(loanable__library__enabled=True)) |
                                    Q(loanable__library='bd-tek'))
        self.assertCanOnlyListTheseLoans(loans, 200, user)

    ############
    # RETRIEVE #
    ############

    def assertAccessToLoan(self, loan_id, code=200, user=''):
        """Fail if access is not given to loan loan_id."""

        res = self.get(f'loans/{loan_id}/')
        self.assertEqual(res.status_code, code, msg=f'User {user} cannot access loan {loan_id}.')

    def assertNoAccessToLoan(self, loan_id, code=403, codes=None, user=''):
        """Fail if access is given to loan loan_id."""

        res = self.get(f'loans/{loan_id}/')

        if codes is not None:
            self.assertIn(res.status_code, codes, msg=f'User {user} can access loan {loan_id}.')
        else:
            self.assertEqual(res.status_code, code, msg=f'User {user} can access loan {loan_id}.')

    def test_if_not_logged_in_then_no_access_to_loan(self):
        self.assertNoAccessToLoan(0, 401)

    def test_if_user_then_access_to_own_loan(self):
        for user in ALL_USERS:
            self.login(user)

            for loan in Loan.objects.filter(user=user, loanable__library__enabled=True):
                self.assertAccessToLoan(loan.id, code=200, user=user)

    def test_if_not_library_admin_then_only_access_to_own_loan_in_enabled_libraries(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_ADMIN:
            self.login(user)

            for loan in Loan.objects.all():
                if loan.user.id == user and loan.loanable.library.enabled:
                    self.assertAccessToLoan(loan.id, code=200, user=user)
                else:
                    # Either the loan is in a disabled library, or it does not exist.
                    self.assertNoAccessToLoan(loan.id, codes=[403, 404], user=user)

    def test_if_library_admin_then_only_access_to_own_loans_and_library_loans(self):
        user = '17library_bd-tek'
        self.login(user)

        for loan in Loan.objects.all():
            if (loan.user.id == user or loan.loanable.library.id == 'bd-tek') and loan.loanable.library.enabled:
                self.assertAccessToLoan(loan.id, 200, user=user)
            else:
                # Either the library is not enabled, so 403, or the loan doesn't exist.
                self.assertNoAccessToLoan(loan.id, codes=[403, 404], user=user)

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
        self.assertStatusCode(res, code)
        self.assertEqual(length_before + 1, len(Loan.objects.all()), f'User {user} did not manage to insert {data}.')

    def assertCannotCreateLoan(self, user, data, code=403):
        self.login(user)
        length_before = len(Loan.objects.all())
        res = self.post('loans/', data=data)
        self.assertStatusCode(res, code)
        self.assertEqual(length_before, len(Loan.objects.all()), f'User {user} managed to insert {data}.')

    def test_if_library_enabled_then_can_create_loan(self):
        loanable_id = 3
        self.assertTrue(Loanable.objects.get(pk=loanable_id).library.enabled,
                        f'Test premise is wrong: library of loanable {loanable_id} is not enabled')

        for user in ALL_USERS:
            self.assertCanCreateLoan(user, data={'user': user, 'loanable': loanable_id}, code=201)

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

        for user in ALL_USERS_EXCEPT_LIBRARY_ADMIN:
            self.login(user)
            res = self.post('loans/', data={'user': user, 'loanable': loanable_id})

            self.assertStatusCode(res, 201)
            last_loan = Loan.objects.order_by('-id')[0]
            self.assertEqual(last_loan.loanable_id, loanable_id)
            self.assertEqual(last_loan.user.id, user)
            self.assertEqual(last_loan.status, 'PENDING')
            self.assertEqual(last_loan.loan_date, None)
            self.assertEqual(last_loan.expected_return_date, None)
            self.assertEqual(last_loan.real_return_date, None)

    def test_if_not_library_administrator_and_library_disabled_then_cannot_create_loan(self):
        loanable_id = 1
        self.assertFalse(Loanable.objects.get(pk=loanable_id).library.enabled,
                         f'Test premise is wrong: library of loanable {loanable_id} is not disabled')

        for user in ALL_USERS_EXCEPT_LIBRARY_BIERO:
            self.assertCannotCreateLoan(user, data={'user': user, 'loanable': loanable_id})

    def test_if_not_library_administrator_then_cannot_create_loan_for_another_user_in_own_library(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            if user != '17wan-fat':
                self.assertCannotCreateLoan(user, data={'loanable': 3, 'user': '17wan-fat'}, code=403)

    def test_if_not_library_administrator_and_loanable_already_borrowed_then_cannot_create_loan(self):
        loanable_id = 4
        self.assertTrue(Loanable.objects.get(pk=loanable_id).is_borrowed(),
                        f'Test premise is wrong: loanable {loanable_id} is not borrowed.')

        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.assertCannotCreateLoan(user, data={'user': user, 'loanable': loanable_id}, code=400)

    ##########
    # UPDATE #
    ##########

    def assertCanUpdateStatus(self, user, loans, old_status, new_status):
        """
        Fail if there exist at least one loan from loans such as loan.status = old_status and the provided user
        cannot update the status of loan to new_status.

        :return a boolean telling if the test was run at least once.
        """
        self.login(user)
        run = False

        for loan in [x for x in loans if x.status == old_status]:
            res = self.patch(f'loans/{loan.id}/', {'status': new_status})
            self.assertStatusCode(res, 200)

            loan = Loan.objects.get(id=loan.id)
            self.assertEqual(loan.status, new_status,
                             msg=f'User {user} did not manage to update the status of loan {loan.id} '
                                 f'from {old_status}to {new_status}.')
            # Revert the change.
            loan.status = old_status
            loan.save()

            run = True

        return run

    def Status(self, user, loans, old_status, new_status):
        """
        Fail if there exist at least one loan from loans such as loan.status = old_status and the provided user
        can update the status of loan to new_status.

        :return a boolean telling if the test was run at least once.
        """
        self.login(user)
        run = False

        for loan in [x for x in loans if x.status == old_status]:
            res = self.patch(f'loans/{loan.id}/', {'status': new_status})
            self.assertStatusCode(res, 403)
            self.assertEqual(Loan.objects.get(id=loan.id).status, old_status,
                             msg=f'User {user} did manage to update the status of loan {loan.id}'
                                 f'from {old_status}to {new_status}.')
            run = True

        return run

    def test_every_user_can_update_own_loan_status_from_pending_to_cancelled_in_enabled_libraries(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_BD_TEK:
            self.assertTrue(self.assertCanUpdateStatus(user,
                                                       Loan.objects.filter(user=user, loanable__library__enabled=True),
                                                       'PENDING', 'CANCELLED'),
                            msg=f'The test needs {user} to have a PENDING loan in an enabled library.')

    def test_if_not_library_administrator_then_cannot_update_own_loan_status_except_from_pending_to_cancelled(self):
        for (old_status, new_status) in self.STATUS_COUPLES:
            if 'PENDING' == old_status and 'CANCELLED' == new_status:
                break

            run = False
            for user in ALL_USERS_EXCEPT_LIBRARY_ADMIN:
                run = run or self.assertCannotUpdateStatus(user, Loan.objects.filter(user=user), old_status, new_status)

            self.assertTrue(run, msg=f'The test needs a Loan which status is {old_status} and'
                                     f'which belongs to someone who is not a library manager to run.')

    def test_if_library_administrator_then_can_update_status_of_own_library_loans(self):
        user = '17library_bd-tek'

        for (old_status, new_status) in self.STATUS_COUPLES:
            self.assertTrue(self.assertCanUpdateStatus(user,
                                                       Loan.objects.filter(loanable__library='bd-tek'),
                                                       old_status,
                                                       new_status),
                            msg=f'The test needs a Loan from bd-tek with {old_status} status to run.')

    def test_if_library_administrator_then_cannot_update_status_of_other_library_loans(self):
        user = '17library_bd-tek'

        for (old_status, new_status) in self.STATUS_COUPLES:
            loans = Loan.objects.exclude(loanable__library='bd-tek')

            # Remove the user's own loans in that case, as an user can always cancel its own PENDING loan.
            if old_status == 'PENDING' and new_status == 'CANCELLED':
                loans = loans.exclude(user=user)

            self.assertTrue(self.assertCannotUpdateStatus(user, loans, old_status, new_status),
                            msg=f'The test needs a Loan not from bd-tek and with {old_status} status to run.')

    def test_if_library_administrator_then_cannot_update_with_inconsistent_dates(self):
        user = '17library_bd-tek'
        self.login(user)

        for loan in Loan.objects.filter(loanable__library='bd-tek'):
            loan_date = datetime(2018, 1, 3, 12, 00, 00, tzinfo=timezone.utc)
            # Expected return date before the loan date.
            expected_return_date = datetime(2018, 1, 1, 12, 00, 00, tzinfo=timezone.utc)
            # Real return date before the loan date.
            real_return_date = datetime(2018, 1, 1, 12, 00, 00, tzinfo=timezone.utc)

            res = self.patch(f'loans/{loan.id}/',
                             {'loan_date': loan_date, 'expected_return_date': expected_return_date})
            self.assertStatusCode(res, 400)
            self.assertEqual(Loan.objects.get(id=loan.id).loan_date, loan.loan_date,
                             msg=f'User {user} did manage to update loan id {loan.id}.')
            self.assertEqual(Loan.objects.get(id=loan.id).expected_return_date, loan.expected_return_date,
                             msg=f'User {user} did manage to update loan id {loan.id}.')

            res = self.patch(f'loans/{loan.id}/',
                             {'loan_date': loan_date, 'real_return_date': real_return_date})
            self.assertStatusCode(res, 400)
            self.assertEqual(Loan.objects.get(id=loan.id).loan_date, loan.loan_date,
                             msg=f'User {user} did manage to update loan id {loan.id}.')
            self.assertEqual(Loan.objects.get(id=loan.id).real_return_date, loan.real_return_date,
                             msg=f'User {user} did manage to update loan id {loan.id}.')

    def test_if_library_administrator_then_can_update_with_consistent_loan_date(self):
        user = '17library_bd-tek'
        self.login(user)

        for loan in Loan.objects.filter(loanable__library='bd-tek'):
            loan_date = datetime(2018, 1, 1, 12, 00, 00, tzinfo=timezone.utc)
            res = self.patch(f'loans/{loan.id}/', {'loan_date': loan_date})
            self.assertStatusCode(res, 200)
            self.assertEqual(Loan.objects.get(id=loan.id).loan_date, loan_date,
                             msg=f'User {user} did not manage to update loan_date of loan id {loan.id}.')

    def test_if_library_administrator_then_cannot_update_with_inconsistent_loan_date(self):
        user = '17library_bd-tek'
        self.login(user)
        loans = Loan.objects.filter(Q(loanable__library='bd-tek'),
                                    ~Q(expected_return_date=None) | ~Q(real_return_date=None))
        self.assertNotEqual(len(loans), 0, msg='The test needs a Loan in bd-tek Library with either'
                                               'expected_return_date or real_return_date set to run.')

        for loan in loans:
            if loan.expected_return_date is not None:
                loan_date = loan.expected_return_date + timedelta(10)
            else:
                loan_date = loan.real_return_date + timedelta(10)
            res = self.patch(f'loans/{loan.id}/', {'loan_date': loan_date})
            self.assertStatusCode(res, 400)
            self.assertEqual(Loan.objects.get(id=loan.id).loan_date, loan.loan_date,
                             msg=f'User {user} did manage to update loan_date of loan id {loan.id}.')

    def test_if_library_administrator_then_can_update_with_consistent_expected_return_date(self):
        user = '17library_bd-tek'
        self.login(user)

        for loan in Loan.objects.filter(loanable__library='bd-tek'):
            if loan.loan_date is None:
                expected_return_date = datetime(2018, 1, 1, 12, 00, 00, tzinfo=timezone.utc)
            else:
                expected_return_date = loan.loan_date + timedelta(days=7)

            res = self.patch(f'loans/{loan.id}/', {'expected_return_date': expected_return_date})
            self.assertStatusCode(res, 200)
            self.assertEqual(Loan.objects.get(id=loan.id).expected_return_date, expected_return_date,
                             msg=f'User {user} did not manage to update expected_return_date of loan id {loan.id}.')

    def test_if_library_administrator_then_cannot_update_with_inconsistent_expected_return_date(self):
        user = '17library_bd-tek'
        self.login(user)

        loans = Loan.objects.filter(loanable__library='bd-tek').exclude(loan_date=None)
        self.assertNotEqual(len(loans), 0, msg='The test needs a Loan in bd-tek Library with loan_date set to run.')

        for loan in loans:
            expected_return_date = loan.loan_date - timedelta(10)
            res = self.patch(f'loans/{loan.id}/', {'expected_return_date': expected_return_date})
            self.assertStatusCode(res, 400)
            self.assertEqual(Loan.objects.get(id=loan.id).expected_return_date, loan.expected_return_date,
                             msg=f'User {user} did manage to update expected_return_date of loan id {loan.id}.')

    def test_if_library_administrator_then_can_update_with_consistent_real_return_date(self):
        user = '17library_bd-tek'
        self.login(user)

        for loan in Loan.objects.filter(loanable__library='bd-tek'):
            if loan.expected_return_date is None or loan.loan_date is None:
                if loan.loan_date is None:
                    real_return_date = datetime(2018, 1, 1, 12, 00, 00, tzinfo=timezone.utc)
                else:
                    real_return_date = loan.loan_date + timedelta(days=5)
            else:
                real_return_date = loan.loan_date + (loan.expected_return_date - loan.loan_date) / 2

            res = self.patch(f'loans/{loan.id}/', {'real_return_date': real_return_date})
            self.assertStatusCode(res, 200)
            self.assertEqual(Loan.objects.get(id=loan.id).real_return_date, real_return_date,
                             msg=f'User {user} did not manage to update real_return_date of loan id {loan.id}.')

    def test_if_library_administrator_then_cannot_update_with_inconsistent_real_return_date(self):
        user = '17library_bd-tek'
        self.login(user)

        loans = Loan.objects.filter(loanable__library='bd-tek').exclude(loan_date=None)
        self.assertNotEqual(len(loans), 0, msg='The test needs a Loan in bd-tek Library with loan_date set to run.')

        for loan in loans:
            real_return_date = loan.loan_date - timedelta(10)
            res = self.patch(f'loans/{loan.id}/', {'real_return_date': real_return_date})
            self.assertStatusCode(res, 400)
            self.assertEqual(Loan.objects.get(id=loan.id).real_return_date, loan.real_return_date,
                             msg=f'User {user} did manage to update real_return_date of loan id {loan.id}.')

    def test_if_library_administrator_then_cannot_update_dates_of_other_library_loans(self):
        user = '17library_bd-tek'
        self.login(user)

        for loan in Loan.objects.exclude(loanable__library='bd-tek'):
            loan_date = datetime(2018, 1, 1, 12, 00, 00)
            res = self.patch(f'loans/{loan.id}/', {'loan_date': loan_date})
            self.assertStatusCode(res, 403)
            self.assertNotEqual(Loan.objects.get(id=loan.id).loan_date, loan_date,
                                msg=f'User {user} did manage to update loan_date of loan id {loan.id}.')

            expected_return_date = loan_date + timedelta(days=7)
            res = self.patch(f'loans/{loan.id}/', {'expected_return_date': expected_return_date})
            self.assertStatusCode(res, 403)
            self.assertNotEqual(Loan.objects.get(id=loan.id).expected_return_date, expected_return_date,
                                msg=f'User {user} did manage to update expected_return_date of loan id {loan.id}.')

            real_return_date = loan_date + timedelta(days=4)
            res = self.patch(f'loans/{loan.id}/', {'real_return_date': real_return_date})
            self.assertStatusCode(res, 403)
            self.assertNotEqual(Loan.objects.get(id=loan.id).real_return_date, real_return_date,
                                msg=f'User {user} did manage to update real_return_date of loan id {loan.id}.')

    ##########
    # DELETE #
    ##########

    def test_if_not_library_administrator_then_cannot_delete_loan(self):
        for user in ALL_USERS_EXCEPT_LIBRARY_ADMIN:
            self.login(user)

            for loan in Loan.objects.all():
                res = self.delete(f'loans/{loan.id}/', '')
                # Depends on whether the user can see the loan.
                self.assertIn(res.status_code, [403, 404], msg=f'User {user} did manage to delete Loan id {loan.id}.')
                self.assertTrue(Loan.objects.filter(id=loan.id).exists(),
                                msg=f'User {user} did manage to delete Loan id {loan.id}.')

    def test_if_library_administrator_then_can_delete_loan_from_own_library(self):
        user = '17library_bd-tek'
        self.login(user)

        for loan in Loan.objects.filter(loanable__library='bd-tek'):
            res = self.delete(f'loans/{loan.id}/', '')
            self.assertStatusCode(res, 204, user_msg=f'{loan.id}')
            self.assertFalse(Loan.objects.filter(id=loan.id).exists(),
                             msg=f'User {user} did not manage to delete Loan id {loan.id}.')

    def test_if_library_administrator_then_cannot_delete_loan_from_other_library(self):
        user = '17library_bd-tek'
        self.login(user)

        loans = Loan.objects.exclude(loanable__library='bd-tek')
        self.assertNotEqual(len(loans), 0, msg='The test needs a Loan not belonging to bd-tek to run.')

        for loan in loans:
            res = self.delete(f'loans/{loan.id}/', '')
            self.assertIn(res.status_code, (403, 404))  # Depends on whether the user can see the loan (own loan).
            self.assertTrue(Loan.objects.filter(id=loan.id).exists(),
                            msg=f'User {user} did manage to delete Loan id {loan.id}.')
