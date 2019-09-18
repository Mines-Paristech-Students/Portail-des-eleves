from django.core.exceptions import ObjectDoesNotExist

from associations.models import Page
from associations.tests.page.base_test_page import *


class PageAssociationTestCase(BasePageTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_page(self):
        res = self.list(association_id='biero')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_page(self):
        self.login('17simple')
        res = self.list(association_id='biero')
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_page(self):
        res = self.retrieve(association_id='biero', pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_page(self):
        self.login('17simple')
        res = self.retrieve(association_id='biero', pk=1)
        self.assertStatusCode(res, 200)

    def test_if_page_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.retrieve(association_id='biero', pk=42)
        self.assertFalse(Page.objects.filter(pk='42').exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    page = {
        'title': 'Les bières',
        'text': 'Tout ce que tu veux, des belges, des IPA, des pressions…',
    }

    def test_if_not_page_admin_then_cannot_create_page(self):
        for user in ALL_USERS_EXCEPT_PAGE_BIERO:
            self.login(user)
            res = self.create(association_id='biero', data=self.page)
            self.assertStatusCode(res, 403, user_msg=user)
            self.assertRaises(ObjectDoesNotExist, Page.objects.get, title=self.page['title'])

    def test_if_page_admin_then_can_create_page(self):
        self.login('17page_biero')  # Page administrator.
        res = self.create(association_id='biero', data=self.page)
        self.assertStatusCode(res, 201)

        self.assertTrue(Page.objects.filter(title=self.page['title']).exists())
        page = Page.objects.get(title=self.page['title'])
        self.assertEqual(page.text, self.page['text'])

    ##########
    # UPDATE #
    ##########

    update_page = {
        'pk': 0,
        'title': 'La _vraie_ équipe',
        'text': 'Un président hilarant qui écrit des mails psychopathes.',
    }

    disallowed_update_page = {
        'pk': 0,
        'association': 'pdm',
    }

    def test_if_not_page_admin_then_cannot_update_page(self):
        for user in ALL_USERS_EXCEPT_PAGE_BIERO:
            self.login(user)
            page_before = Page.objects.get(pk = self.update_page['pk'])
            res = self.update(self.update_page['pk'], data=self.update_page, association_id='biero')
            self.assertStatusCode(res, 403)
            self.assertEqual(Page.objects.get(pk=self.update_page['pk']).title, page_before.title)

    def test_if_page_admin_then_can_update_page(self):
        self.login('17page_biero')
        res = self.update(self.update_page['pk'], data=self.update_page, association_id='biero')
        self.assertStatusCode(res, 200)

        page = Page.objects.get(pk=self.update_page['pk'])
        self.assertEqual(page.title, self.update_page['title'])
        self.assertEqual(page.text, self.update_page['text'])

    def test_if_page_admin_then_cannot_update_association(self):
        self.login('17page_biero')
        res = self.update(self.disallowed_update_page['pk'],
                          data=self.disallowed_update_page,
                          association_id='biero')
        self.assertStatusCode(res, 200)
        self.assertNotEqual(Page.objects.get(pk=self.disallowed_update_page['pk']).association_id,
                            self.disallowed_update_page['association'])

    ###########
    # DESTROY #
    ###########

    def test_if_not_page_admin_then_cannot_destroy_page(self):
        for user in ALL_USERS_EXCEPT_PAGE_BIERO:
            self.login(user)
            res = self.destroy(1, association_id='biero')
            self.assertStatusCode(res, 403)
            self.assertTrue(Page.objects.filter(pk=1).exists())

    def test_if_page_admin_then_can_destroy_page(self):
        self.login('17page_biero')  # Page administrator.
        res = self.destroy(1, 'biero')
        self.assertStatusCode(res, 204)
        self.assertFalse(Page.objects.filter(pk=1).exists())
