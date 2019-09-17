from django.db.models import Q

from associations.models import Transaction, Product
from associations.tests.marketplace import *


class TransactionTestCase(BaseMarketPlaceTestCase):
    # Please see the diagram in associations.models.marketplace.Transaction.
    STATUS_COUPLES = [
        ('ORDERED', 'CANCELLED'),
        ('ORDERED', 'VALIDATED'),
        ('ORDERED', 'REJECTED'),
        ('CANCELLED', 'ORDERED'),
        ('VALIDATED', 'ORDERED'),
        ('REJECTED', 'ORDERED'),
        ('VALIDATED', 'DELIVERED'),
        ('DELIVERED', 'VALIDATED'),
        ('DELIVERED', 'REFUNDED'),
        ('REFUNDED', 'DELIVERED'),
    ]

    #################
    # GLOBAL POLICY #
    #################

    # LIST & RETRIEVE
    # Can X see the transactions of Y?
    #
    # || X \\ Y             | Herself | Association members | Everyone ||
    # || Simple user        | Yes     | No                  | No       ||
    # || Association member | Yes     | No                  | No       ||
    # || Market admin       | Yes     | Yes                 | No       ||
    # || Association admin  | Yes     | No                  | No       ||
    # || Global admin       | Yes     | No                  | No       ||
    #
    #
    # CREATE
    # An user must ONLY provide the buyer, product and quantity fields in the request.
    # Any extra field will result in a 403.
    # The only exception to this rule concerns the market administrators, who can provide any fields they want.

    ########
    # LIST #
    ########

    def assertCanListTheseTransactions(self, transactions, code=200, user=''):
        """Fail if the transactions listed at "transactions/" do not contain the transactions passed as a parameter."""
        self.login(user)
        res = self.get('transactions/')
        self.assertEqual(res.status_code, code)

        res_ids = set([transaction['id'] for transaction in res.data])
        for transaction in transactions:
            self.assertIn(transaction.id, res_ids, msg=f'User {user} cannot list transaction {transaction.id}.')

    def assertCanOnlyListTheseTransactions(self, transactions, code=200, user=''):
        """Fail if the transactions listed at "transactions/" are not exactly the transactions passed as a parameter."""

        self.login(user)
        res = self.get('transactions/')
        self.assertEqual(res.status_code, code)

        res_ids = set([transaction['id'] for transaction in res.data])
        expected_ids = set([transaction.id for transaction in transactions])
        self.assertEqual(res_ids, expected_ids, msg=f'User {user}: expected list {expected_ids}, got list {res_ids}.')

    def test_if_not_logged_in_then_no_access_to_transactions(self):
        res = self.get('transactions/')
        self.assertStatusCode(res, 401)

    def test_if_user_then_access_to_own_transactions_in_enabled_markets(self):
        for user in ALL_USERS:
            self.assertCanListTheseTransactions(
                Transaction.objects.filter(buyer=user, product__marketplace__enabled=True),
                200, user)

    def test_if_not_market_admin_then_only_access_to_own_transactions(self):
        for user in ALL_USERS_EXCEPT_MARKET_ADMIN:
            self.assertCanOnlyListTheseTransactions(
                Transaction.objects.filter(buyer=user, product__marketplace__enabled=True), 200, user)

    def test_if_market_admin_then_only_access_to_association_transactions_and_own_transactions(self):
        user = '17market_biero'
        self.login(user)
        transactions = Transaction.objects.filter((Q(buyer__id=user) & Q(product__marketplace__enabled=True)) |
                                                  Q(product__marketplace='biero'))
        self.assertCanOnlyListTheseTransactions(transactions, 200, user)

    ############
    # RETRIEVE #
    ############

    def assertAccessToTransaction(self, transaction_id, code=200, user=''):
        """Fail if access is not given to transaction transaction_id."""

        res = self.get(f'transactions/{transaction_id}/')
        self.assertEqual(res.status_code, code, msg=f'User {user} cannot access transaction {transaction_id}.')

    def assertNoAccessToTransaction(self, transaction_id, code=403, codes=None, user=''):
        """Fail if access is given to transaction transaction_id."""

        res = self.get(f'transactions/{transaction_id}/')

        if codes is not None:
            self.assertIn(res.status_code, codes, msg=f'User {user} can access transaction {transaction_id}.')
        else:
            self.assertEqual(res.status_code, code, msg=f'User {user} can access transaction {transaction_id}.')

    def test_if_not_logged_in_then_no_access_to_transaction(self):
        self.assertNoAccessToTransaction(0, 401)

    def test_if_user_then_access_to_own_transaction(self):
        for user in ALL_USERS:
            self.login(user)

            for transaction in Transaction.objects.filter(buyer=user, product__marketplace__enabled=True):
                self.assertAccessToTransaction(transaction.id, code=200, user=user)

    def test_if_not_market_admin_then_only_access_to_own_transaction_in_enabled_markets(self):
        for user in ALL_USERS_EXCEPT_MARKET_ADMIN:
            self.login(user)

            for transaction in Transaction.objects.all():
                if transaction.buyer_id == user and transaction.product.marketplace.enabled:
                    self.assertAccessToTransaction(transaction.id, code=200, user=user)
                else:
                    # Either the transaction is in a disabled market, or it does not exist.
                    self.assertNoAccessToTransaction(transaction.id, codes=[403, 404], user=user)

    def test_if_market_admin_then_only_access_to_own_transactions_and_market_transactions(self):
        user = '17market_biero'
        self.login(user)

        for transaction in Transaction.objects.all():
            if (transaction.buyer_id == user or transaction.product_marketplace_id == 'biero') and \
                    transaction.product.marketplace.enabled:
                self.assertAccessToTransaction(transaction.id, 200, user=user)
            else:
                # Either the market is not enabled, so 403, or the transaction doesn't exist.
                self.assertNoAccessToTransaction(transaction.id, codes=[403, 404], user=user)

    def test_if_transaction_does_not_exist_then_404(self):
        self.login('17simple')
        self.assertNoAccessToTransaction(42, 404)

    ##########
    # CREATE #
    ##########

    def assertCanCreateTransaction(self, user, data, code=201):
        self.login(user)
        length_before = len(Transaction.objects.all())
        res = self.post('transactions/', data=data)
        self.assertStatusCode(res, code)
        self.assertEqual(length_before + 1, len(Transaction.objects.all()),
                         f'User {user} did not manage to insert {data}.')

    def assertCannotCreateTransaction(self, user, data, code=403):
        self.login(user)
        length_before = len(Transaction.objects.all())
        res = self.post('transactions/', data=data)
        self.assertStatusCode(res, code)
        self.assertEqual(length_before, len(Transaction.objects.all()), f'User {user} managed to insert {data}.')

    def test_if_market_enabled_then_can_create_transaction(self):
        product_id = 3
        self.assertTrue(Product.objects.get(pk=product_id).marketplace.enabled,
                        f'Test premise is wrong: market of product {product_id} is not enabled')

        for user in ALL_USERS:
            self.assertCanCreateTransaction(user, data={'buyer': user, 'product': product_id, 'quantity': 1}, code=201)

    def test_verify_transaction_entry_if_not_market_administrator(self):
        """
        When a transaction is created:\n
        * the id is set automatically;\n
        * the product and user fields are set to the required value;\n
        * the status is set to ORDERED.
        """
        product_id = 3
        self.assertTrue(Product.objects.get(pk=product_id).marketplace.enabled,
                        f'Test premise is wrong: market of product {product_id} is not enabled')

        for user in ALL_USERS_EXCEPT_MARKET_ADMIN:
            self.login(user)
            res = self.post('transactions/', data={'buyer': user, 'product': product_id, 'quantity': 1})

            self.assertStatusCode(res, 201)
            last_transaction = Transaction.objects.order_by('-id')[0]
            self.assertEqual(last_transaction.product.id, product_id)
            self.assertEqual(last_transaction.buyer.id, user)
            self.assertEqual(last_transaction.quantity, 1)
            self.assertEqual(last_transaction.value, Product.objects.get(pk=product_id).price)
            self.assertEqual(last_transaction.status, 'ORDERED')

    def test_if_not_market_administrator_and_market_disabled_then_cannot_create_transaction(self):
        product_id = 4
        self.assertFalse(Product.objects.get(pk=product_id).marketplace.enabled,
                         f'Test premise is wrong: market of product {product_id} is not disabled.')

        for user in ALL_USERS_EXCEPT_MARKET_PDM:
            self.assertCannotCreateTransaction(user, data={'buyer': user, 'product': product_id, 'quantity': 1})

    def test_if_not_market_administrator_then_cannot_create_transaction_for_another_user(self):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            if user != '17wan-fat':
                self.assertCannotCreateTransaction(user, data={'product': 3, 'quantity': 1,
                                                               'buyer': '17wan-fat'}, code=403)

    def test_if_not_enough_products_then_cannot_create_transaction(self):
        product_id = 1
        self.assertTrue(Product.objects.get(pk=product_id).marketplace.enabled,
                        f'Test premise is wrong: market of product {product_id} is not enabled.')

        number_left = Product.objects.get(pk=product_id).number_left
        quantity = number_left + 1

        for user in ALL_USERS:
            self.assertCannotCreateTransaction(user,
                                               data={'buyer': user, 'product': product_id, 'quantity': quantity},
                                               code=400)

    ##########
    # UPDATE #
    ##########

    def assertCanUpdateStatus(self, user, transactions, old_status, new_status):
        """
        Fail if there exist at least one transaction from transactions such as transaction.status = old_status and the provided user
        cannot update the status of transaction to new_status.

        :return a boolean telling if the test was run at least once.
        """
        self.login(user)
        run = False

        for transaction in [x for x in transactions if x.status == old_status]:
            res = self.patch(f'transactions/{transaction.id}/', {'status': new_status})
            self.assertStatusCode(res, 200)

            transaction = Transaction.objects.get(id=transaction.id)
            self.assertEqual(transaction.status, new_status,
                             msg=f'User {user} did not manage to update the status of transaction {transaction.id} '
                                 f'from {old_status}to {new_status}.')
            # Revert the change.
            transaction.status = old_status
            transaction.save()

            run = True

        return run

    def assertCannotUpdateStatus(self, user, transactions, old_status, new_status):
        """
        Fail if there exist at least one transaction from transactions such as transaction.status = old_status and the provided user
        can update the status of transaction to new_status.

        :return a boolean telling if the test was run at least once.
        """
        self.login(user)
        run = False

        for transaction in [x for x in transactions if x.status == old_status]:
            res = self.patch(f'transactions/{transaction.id}/', {'status': new_status})
            self.assertStatusCode(res, 403)
            self.assertEqual(Transaction.objects.get(id=transaction.id).status, old_status,
                             msg=f'User {user} did manage to update the status of transaction {transaction.id}'
                                 f'from {old_status}to {new_status}.')
            run = True

        return run

    def test_every_user_can_update_own_transaction_status_from_ordered_to_cancelled_in_enabled_markets(self):
        for user in ALL_USERS_EXCEPT_MARKET_BIERO:
            self.assertTrue(self.assertCanUpdateStatus(user,
                                                       Transaction.objects.filter(buyer=user,
                                                                                  product__marketplace__enabled=True),
                                                       'ORDERED', 'CANCELLED'),
                            msg=f'The test needs {user} to have an ORDERED transaction in an enabled market.')

    def test_if_not_market_administrator_then_cannot_update_own_transaction_status_except_from_ordered_to_cancelled(
            self):
        for (old_status, new_status) in self.STATUS_COUPLES:
            if 'ORDERED' == old_status and 'CANCELLED' == new_status:
                break

            run = False
            for user in ALL_USERS_EXCEPT_MARKET_ADMIN:
                run = run or self.assertCannotUpdateStatus(user, Transaction.objects.filter(buyer=user), old_status,
                                                           new_status)

            self.assertTrue(run, msg=f'The test needs a Transaction which status is {old_status} and'
                                     f'which belongs to someone who is not a market manager to run.')

    def test_if_market_administrator_then_can_update_status_of_own_market_transactions(self):
        user = '17market_biero'

        for (old_status, new_status) in self.STATUS_COUPLES:
            self.assertTrue(self.assertCanUpdateStatus(user,
                                                       Transaction.objects.filter(product__marketplace='biero'),
                                                       old_status,
                                                       new_status),
                            msg=f'The test needs a Transaction from biero with {old_status} status to run.')

    def test_if_market_administrator_then_cannot_update_status_of_other_market_transactions(self):
        user = '17market_biero'

        for (old_status, new_status) in self.STATUS_COUPLES:
            transactions = Transaction.objects.exclude(product__marketplace='biero')

            # Remove the user's own transactions in that case, as an user can always cancel its own ORDERED transaction.
            if old_status == 'ORDERED' and new_status == 'CANCELLED':
                transactions = transactions.exclude(buyer=user)

            self.assertTrue(self.assertCannotUpdateStatus(user, transactions, old_status, new_status),
                            msg=f'The test needs a Transaction not from biero and with {old_status} status to run.')

    ##########
    # DELETE #
    ##########

    def test_cannot_delete_transaction(self):
        for user in ALL_USERS:
            self.login(user)

            for transaction in Transaction.objects.all():
                res = self.delete(f'transactions/{transaction.id}/')

                self.assertEqual(res.status_code, 403, msg=res)
                self.assertTrue(Transaction.objects.filter(id=transaction.id).exists(),
                                msg=f'User {user} did manage to delete Transaction id {transaction.id}.')
