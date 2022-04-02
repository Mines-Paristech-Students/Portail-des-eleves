from datetime import datetime
from games.models.scores import Score
from backend.tests_utils import WeakAuthenticationBaseTestCase
from django.db.models import Sum


class ScoresTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "games.yaml", "test_scores.yaml"]

    EXPECTED_FIELDS = {"game", "user", "score", "when"}
    EXPECTED_GAME_FIELDS = {"id", "name"}

    def endpoint_list(self):
        return "/games/scores/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_filter_game(self, game):
        return f"/games/scores/?game={game}"

    def filter_game(self, game):
        return self.get(self.endpoint_filter_game(game))

    def endpoint_create(self):
        return "/games/scores/"

    def create(self, data=None, courseat="json", content_type="application/json"):
        return self.post(self.endpoint_create(), data, courseat)

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
        prev_date = 0
        print(res.data)
        for score in res.data:
            self.assertSetEqual(set(score.keys()), self.EXPECTED_FIELDS)
            self.assertSetEqual(set(score.game.keys()), self.EXPECTED_GAME_FIELDS)
            # Scores should be sorted by "when" date
            self.assertGreaterEqual(score.when, prev_date)
            prev_date = score.when

    ##########
    # FILTER #
    ##########

    def test_can_filter_by_game(self):
        self.login("17simple")
        game = "2048"
        res = self.filter_game(game)
        self.assertStatusCode(res, 200)
        for score in res.data["results"]:
            self.assertEqual(score["game"]["id"], game)

    ##########
    # CREATE #
    ##########

    create_score_data = {
        "game": "pictionary",
        "user": "17simple",
        "score": 123,
        "when": datetime.now(),
    }

    def test_if_not_global_admin_then_cannot_create(self):
        self.login("17simple")
        res = self.create(self.create_score_data)
        self.assertStatusCode(res, 403)

    def test_if_global_admin_then_can_create(self):
        before_creation_score = Score.objects.filter(
            game=self.create_score_data["game"], user=self.create_score_data["user"]
        ).aggregate(Sum("score"))["score__sum"]

        self.login("17admin")
        res = self.create(self.create_score_data)
        self.assertStatusCode(res, 201)

        after_creation_score = Score.objects.filter(
            game=self.create_score_data["game"], user=self.create_score_data["user"]
        ).aggregate(Sum("score"))["score__sum"]

        self.assertEqual(
            after_creation_score,
            before_creation_score + self.create_score_data["score"],
        )
