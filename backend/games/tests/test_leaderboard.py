from datetime import datetime
from games.models.scores import Score
from backend.tests_utils import WeakAuthenticationBaseTestCase
from django.db.models import Sum


class LeaderboardTestCase(WeakAuthenticationBaseTestCase):
    fixtures = ["test_authentication.yaml", "games.yaml", "test_scores.yaml"]

    EXPECTED_FIELDS = {"user", "total_score"}

    def endpoint_list(self):
        return "/games/scores/leaderboard/"

    def list(self):
        return self.get(self.endpoint_list())

    def endpoint_filter_game(self, game):
        return f"/games/scores/leaderboard/?game={game}"

    def filter_game(self, game):
        return self.get(self.endpoint_filter_game(game))

    def validate_leaderboard_score(self, prev_score, users, score, game=None):
        # Leaderboard should be sorted by decreasing score
        self.assertGreaterEqual(score["total_score"], prev_score)
        prev_score = score["total_score"]
        # This total score should be the sum of every user's score
        if game:
            calculated_total_score = Score.objects.filter(
                user=score["user"], game=game
            ).aggregate(Sum("score"))["score__sum"]
        else:
            calculated_total_score = Score.objects.filter(user=score["user"]).aggregate(
                Sum("score")
            )["score__sum"]
        self.assertEqual(calculated_total_score, score["total_score"])
        # There should not be multiple times the same user in the leaderboard
        self.assertNotIn(score["user"], users)
        users.append(score["user"])

        return prev_score, users

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
        prev_score = 0
        users = []
        for score in res.data[::-1]:
            self.assertSetEqual(set(score.keys()), self.EXPECTED_FIELDS)
            prev_score, users = self.validate_leaderboard_score(
                prev_score, users, score
            )

    ##########
    # FILTER #
    ##########

    def test_can_filter_by_game(self):
        self.login("17simple")
        game = "2048"
        res = self.filter_game(game)
        self.assertStatusCode(res, 200)
        prev_score = 0
        users = []
        for score in res.data["results"][::-1]:
            self.assertSetEqual(set(score.keys()), self.EXPECTED_FIELDS)
            prev_score, users = self.validate_leaderboard_score(
                prev_score, users, score, game
            )
