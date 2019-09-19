from django.core.exceptions import ObjectDoesNotExist

from associations.models import News
from associations.tests.news.base_test_news import *


class NewsAssociationTestCase(BaseNewsTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_news(self):
        res = self.list_association(association_id='biero')
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_news(self):
        self.login('17simple')
        res = self.list_association(association_id='biero')
        self.assertStatusCode(res, 200)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve_news(self):
        res = self.retrieve(association_id='biero', pk=1)
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve_news(self):
        self.login('17simple')
        res = self.retrieve(association_id='biero', pk=1)
        self.assertStatusCode(res, 200)

    def test_if_news_does_not_exist_then_404(self):
        self.login('17simple')
        res = self.retrieve(association_id='biero', pk=42)
        self.assertFalse(News.objects.filter(pk='42').exists())
        self.assertStatusCode(res, 404)

    ##########
    # CREATE #
    ##########

    news = {
        'title': 'Une biéro pas loose !',
        'text': 'On y croyait pas !',
    }

    def test_if_not_news_admin_then_cannot_create_news(self):
        for user in ALL_USERS_EXCEPT_NEWS_BIERO:
            self.login(user)
            res = self.create(association_id='biero', data=self.news)
            self.assertStatusCode(res, 403, user_msg=user)
            self.assertRaises(ObjectDoesNotExist, News.objects.get, title=self.news['title'])

    def test_if_news_admin_then_can_create_news(self):
        self.login('17news_biero')  # News administrator.
        res = self.create(association_id='biero', data=self.news)
        self.assertStatusCode(res, 201)

        self.assertTrue(News.objects.filter(title=self.news['title']).exists())
        news = News.objects.get(title=self.news['title'])
        self.assertEqual(news.text, self.news['text'])

    ##########
    # UPDATE #
    ##########

    def test_if_not_news_admin_then_cannot_update_news(self):
        for user in ALL_USERS_EXCEPT_NEWS_BIERO:
            self.login(user)
            data = {'pk': 1, 'title': 'En fait c’était nul', 'text': 'Personne était là'}
            res = self.update(data['pk'], data=data, association_id='biero')
            self.assertStatusCode(res, 403)
            self.assertEqual(News.objects.get(pk=data['pk']).title, 'Biéro x Vendôme')

    def test_if_news_admin_then_can_update_news(self):
        self.login('17news_biero')
        data = {'pk': 1, 'title': 'En fait c’était nul', 'text': 'Personne était là'}
        res = self.update(data['pk'], data=data, association_id='biero')
        self.assertStatusCode(res, 200)

        news = News.objects.get(pk=data['pk'])
        self.assertEqual(news.title, data['title'])
        self.assertEqual(news.text, data['text'])

    ###########
    # DESTROY #
    ###########

    def test_if_not_news_admin_then_cannot_destroy_news(self):
        for user in ALL_USERS_EXCEPT_NEWS_BIERO:
            self.login(user)
            res = self.destroy(1, association_id='biero')
            self.assertStatusCode(res, 403)
            self.assertTrue(News.objects.filter(pk=1).exists())

    def test_if_news_admin_then_can_destroy_news(self):
        self.login('17news_biero')  # News administrator.
        res = self.destroy(1, 'biero')
        self.assertStatusCode(res, 204)
        self.assertFalse(News.objects.filter(pk=1).exists())
