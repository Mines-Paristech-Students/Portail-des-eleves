from backend.tests_utils import WeakAuthenticationBaseTestCase


class GamesTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "games.yaml"]

    EXPECTED_FIELDS = {"id", "name", "mode", "description", "pub_date"}

    def endpoint_list(self):
        return "/games/game/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_retrieve(self, pk):
        return f"/games/game/{pk}/"

    def retrieve(self, pk):
        return self.get(self.endpoint_retrieve(pk))

    ########
    # LIST #
    ########

    def test_if_not_logged_in_then_cannot_list(self):
        res = self.list()
        self.assertStatusCode(res, 401)

    def if_logged_in_then_can_list(self):
        print(self.login("17simple"))
        res = self.list()
        self.assertStatusCode(res, 200)
        for game in res.data:
            self.assertSetEqual(set(game.keys()), self.EXPECTED_FIELDS)

    ############
    # RETRIEVE #
    ############

    def test_if_not_logged_in_then_cannot_retrieve(self):
        res = self.retrieve("2048")
        self.assertStatusCode(res, 401)

    def test_if_logged_in_then_can_retrieve(self):
        self.login("17simple")
        res = self.retrieve("2048")
        self.assertStatusCode(res, 200)
        self.assertSetEqual(set(res.data), self.EXPECTED_FIELDS)