from datetime import datetime, timezone

from django.core.exceptions import ObjectDoesNotExist

from associations.models import Page
from associations.tests.page.base_test_page import *


class PageAssociationTestCase(BasePageTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_page(self):
        res = self.list(association_id="biero")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_page(self):
        self.login("17simple")
        res = self.list(association_id="biero")
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_page(self):
        res = self.retrieve(association_id="biero", pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_page(self):
        self.login("17simple")
        res = self.retrieve(association_id="biero", pk=1)
        self.assertStatusCode(res, 200)

    def test_if_page_does_not_exist_then_404(self):
        self.login("17simple")
        res = self.retrieve(association_id="biero", pk=42)
        self.assertFalse(Page.objects.filter(pk="42").exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    news_page_data = {
        "association": "biero",
        "title": "Biéro NAOOO",
        "text": "La biéro c’est nao.",
        "page_type": "NEWS",
    }

    static_page_data = {
        "association": "biero",
        "title": "Les bières",
        "text": "Tout ce que tu veux, des belges, des IPA, des pressions…",
        "page_type": "NEWS",
    }

    def test_if_not_page_admin_then_cannot_create_page(self):
        for user in ALL_USERS_EXCEPT_PAGE_BIERO:
            self.login(user)
            res = self.create(association_id="biero", data=self.news_page_data)
            self.assertStatusCode(res, 403, user_msg=user)
            self.assertRaises(
                ObjectDoesNotExist, Page.objects.get, title=self.news_page_data["title"]
            )

    def test_if_page_admin_then_can_create_page(self):
        for page_data in (self.news_page_data, self.static_page_data):
            self.login("17page_biero")  # Page administrator.
            res = self.create(association_id="biero", data=page_data)
            self.assertStatusCode(res, 201)

            self.assertTrue(Page.objects.filter(title=page_data["title"]).exists())

            now = datetime.now(tz=timezone.utc)
            page = Page.objects.get(title=page_data["title"])
            self.assertEqual(page.association.pk, page_data["association"])
            self.assertEqual(page.text, page_data["text"])
            self.assertEqual(page.page_type, page_data["page_type"])
            self.assertTupleEqual(
                (now.day, now.month, now.year, now.hour, now.minute),
                (
                    page.creation_date.day,
                    page.creation_date.month,
                    page.creation_date.year,
                    page.creation_date.hour,
                    page.creation_date.minute,
                ),
            )
            self.assertTupleEqual(
                (now.day, now.month, now.year, now.hour, now.minute),
                (
                    page.last_update_date.day,
                    page.last_update_date.month,
                    page.last_update_date.year,
                    page.last_update_date.hour,
                    page.last_update_date.minute,
                ),
            )
            self.assertTrue(page.authors.filter(pk="17page_biero").exists())

    ##########
    # UPDATE #
    ##########

    valid_update_page_data = {
        "pk": 0,
        "title": "La _vraie_ équipe",
        "text": "Un président hilarant qui écrit des mails psychopathes.",
    }

    invalid_update_page_data = {"pk": 0, "association": "pdm"}

    def test_if_not_page_admin_then_cannot_update_page(self):
        for user in ALL_USERS_EXCEPT_PAGE_BIERO:
            self.login(user)
            page_before = Page.objects.get(pk=self.valid_update_page_data["pk"])
            res = self.update(
                self.valid_update_page_data["pk"],
                data=self.valid_update_page_data,
                association_id="biero",
            )
            self.assertStatusCode(res, 403)
            self.assertEqual(
                Page.objects.get(pk=self.valid_update_page_data["pk"]).title,
                page_before.title,
            )

    def test_if_page_admin_then_can_update_page(self):
        self.login("17page_biero")
        res = self.update(
            self.valid_update_page_data["pk"],
            data=self.valid_update_page_data,
            association_id="biero",
        )
        self.assertStatusCode(res, 200)

        now = datetime.now(tz=timezone.utc)
        page = Page.objects.get(title=self.valid_update_page_data["title"])
        self.assertEqual(page.text, self.valid_update_page_data["text"])
        self.assertTupleEqual(
            (now.day, now.month, now.year, now.hour, now.minute),
            (
                page.last_update_date.day,
                page.last_update_date.month,
                page.last_update_date.year,
                page.last_update_date.hour,
                page.last_update_date.minute,
            ),
        )
        self.assertTrue(page.authors.filter(pk="17page_biero").exists())

    def test_if_page_admin_then_cannot_update_association_field(self):
        self.login("17page_biero")
        res = self.update(
            self.invalid_update_page_data["pk"],
            data=self.invalid_update_page_data,
            association_id="biero",
        )
        self.assertStatusCode(res, 200)
        self.assertNotEqual(
            Page.objects.get(pk=self.invalid_update_page_data["pk"]).association_id,
            self.invalid_update_page_data["association"],
        )

    ###########
    # DESTROY #
    ###########

    def test_if_not_page_admin_then_cannot_destroy_page(self):
        for user in ALL_USERS_EXCEPT_PAGE_BIERO:
            self.login(user)
            res = self.destroy(1, association_id="biero")
            self.assertStatusCode(res, 403)
            self.assertTrue(Page.objects.filter(pk=1).exists())

    def test_if_page_admin_then_can_destroy_page(self):
        self.login("17page_biero")  # Page administrator.
        res = self.destroy(1, "biero")
        self.assertStatusCode(res, 204)
        self.assertFalse(Page.objects.filter(pk=1).exists())
