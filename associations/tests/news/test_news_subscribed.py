from associations.tests.news.base_test_news import *


class NewsSubscribedTestCase(BaseNewsTestCase):
    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_no_access_to_news(self):
        res = self.list_subscribed()
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_access_to_news(self):
        self.login('17simple')
        res = self.list_subscribed()
        self.assertStatusCode(res, 200)

    ##########
    # CREATE #
    ##########

    news = {
        'title': 'Une biéro pas loose !',
        'text': 'On y croyait pas !',
    }

    def test_cannot_create(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.post(self.endpoint_list_subscribed(), data=self.news)
            self.assertStatusCode(res, 405)

    ##########
    # UPDATE #
    ##########

    def test_cannot_update(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.patch(self.endpoint_list_subscribed(), data=self.news)
            self.assertStatusCode(res, 405)

    ##########
    # DELETE #
    ##########

    def test_cannot_delete(self):
        for user in ALL_USERS:
            self.login(user)
            res = self.delete(f'{self.endpoint_list_subscribed()}0')
            self.assertStatusCode(res, 404)
