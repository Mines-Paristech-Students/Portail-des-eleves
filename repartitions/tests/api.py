import json
import threading
import time
from unittest.mock import patch

from associations.tests.base_test import BaseTestCase
from repartitions.models import Campaign, Group, Proposition


class APITestCase(BaseTestCase):
    fixtures = ['authentication.yaml', 'test_repartition_api.yaml']

    def test_create_campaign(self):

        # For an admin

        self.login("17bocquet")
        res = self.post("/repartitions/campaigns/", {"name": "MIGs groups"})
        self.assertEqual(res.status_code, 201)

        res = self.get("/repartitions/campaigns/")
        self.assertEqual(len(json.loads(res.content)), 2)  # we created the campaign

        res = self.delete("/repartitions/campaigns/2/")
        self.assertEqual(res.status_code, 204)

        res = self.get("/repartitions/campaigns/")
        self.assertEqual(len(json.loads(res.content)), 1)  # we created the campaign

        # For a non admin

        res = self.post("/repartitions/campaigns/", {"name": "MIGs groups"})  # recreate a new campaign
        self.assertEqual(res.status_code, 201)

        self.login("15menou")
        res = self.get("/repartitions/campaigns/")
        self.assertEqual(len(json.loads(res.content)), 1)  # this user is not linked to the new campaign

        res = self.post("/repartitions/campaigns/", {"name": "MIGs groups 2"})
        self.assertEqual(res.status_code, 403)

    def test_patch_campaign(self):
        self.login("17bocquet")
        res = self.patch("/repartitions/campaigns/1/", {"status": "OPEN"})
        self.assertEqual(res.status_code, 200)

        self.login("15menou")
        res = self.patch("/repartitions/campaigns/1/")
        self.assertEqual(res.status_code, 403)

    def test_change_status(self):
        for status in ["CLOSED", "OPEN", "RESULTS"]:
            self.login("17bocquet")
            res = self.patch("/repartitions/campaigns/1/", {"status": status})
            self.assertEqual(res.status_code, 200)

        for status in ["closed", "frozen-waffles", "RESULT"]:
            self.login("17bocquet")
            res = self.patch("/repartitions/campaigns/1/", {"status": status})
            self.assertEqual(res.status_code, 400)

    def test_user_endpoints(self):
        # For an admin

        self.login("17bocquet")

        res = self.get("/repartitions/campaigns/1/users/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.content), [
            {"user": "17bocquet", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
            {"user": "15menou", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
            {"user": "18chlieh", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
        ])

        res = self.post("/repartitions/campaigns/1/users/",
                        {"user": "17wan-fat", "category": 1, "wishes": [], "fixed_to": None})
        self.assertEqual(res.status_code, 201)
        res = self.get("/repartitions/campaigns/1/users/")  # Check that the user was added
        self.assertEqual(json.loads(res.content), [
            {"user": "17bocquet", "wishes": [], "category": {"id": 1, "name": "Everyone"},
             "fixed_to": None},
            {"user": "15menou", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
            {"user": "18chlieh", "wishes": [], "category": {"id": 1, "name": "Everyone"},
             "fixed_to": None},
            {"user": "17wan-fat", "wishes": [], "category": {"id": 1, "name": "Everyone"},
             "fixed_to": None},
        ])

        res = self.get("/repartitions/campaigns/1/users/17wan-fat/")
        self.assertEqual(res.status_code, 200)

        res = self.delete("/repartitions/campaigns/1/users/17wan-fat/")
        self.assertEqual(res.status_code, 204)
        res = self.get("/repartitions/campaigns/1/users/")  # Check that the user was removed
        self.assertEqual(json.loads(res.content), [
            {"user": "17bocquet", "wishes": [], "category": {"id": 1, "name": "Everyone"},
             "fixed_to": None},
            {"user": "15menou", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
            {"user": "18chlieh", "wishes": [], "category": {"id": 1, "name": "Everyone"},
             "fixed_to": None},
        ]
                         )

        # For a non admin

        self.login("15menou")
        res = self.get("/repartitions/campaigns/1/users/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.content), [
            {"user": "17bocquet"},
            {"user": "15menou"},
            {"user": "18chlieh"},
        ])

        res = self.post("/repartitions/campaigns/1/users/", {"user": "17wan-fat", "category": "Everyone"})
        self.assertEqual(res.status_code, 403)

        res = self.delete("/repartitions/campaigns/1/users/17wan-fat/")
        self.assertEqual(res.status_code, 403)

    def test_fix_user(self):
        self.login("17bocquet")

        res = self.patch("/repartitions/campaigns/1/users/15menou/", {"fixed_to": 1})
        self.assertEqual(res.status_code, 200)
        res = self.get("/repartitions/campaigns/1/users/")  # Check that the user was added
        self.assertEqual(json.loads(res.content), [
            {"user": "17bocquet", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
            {"user": "18chlieh", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
            {"user": "15menou", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": 1},
        ])

        res = self.patch("/repartitions/campaigns/1/users/15menou/", {"fixed_to": None})
        self.assertEqual(res.status_code, 200)
        res = self.get("/repartitions/campaigns/1/users/")  # Check that the user was added
        self.assertEqual(json.loads(res.content), [
            {"user": "17bocquet", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
            {"user": "18chlieh", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
            {"user": "15menou", "wishes": [], "category": {"id": 1, "name": "Everyone"}, "fixed_to": None},
        ])

    def test_submit_wishes(self):
        self.login("17bocquet")
        res = self.patch("/repartitions/campaigns/1/", data={"status": "OPEN"})
        self.assertEqual(res.status_code, 200)

        self.login("15menou")

        # good request

        res = self.post("/repartitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
                {"proposition": 3, "rank": 3}
            ]
        })
        self.assertEqual(res.status_code, 202)

        res = self.get("/repartitions/1/wishes/")  # Check that the user was added
        self.assertEqual(json.loads(res.content), [
            {"proposition": 1, "rank": 1},
            {"proposition": 2, "rank": 2},
            {"proposition": 3, "rank": 3}
        ])

        # bad requests

        res = self.post("/repartitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
            ]
        })
        self.assertEqual(res.status_code, 400)

        res = self.post("/repartitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
                {"proposition": 2, "rank": 3}
            ]
        })
        self.assertEqual(res.status_code, 400)

        res = self.post("/repartitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
                {"proposition": 3, "rank": 1}
            ]
        })
        self.assertEqual(res.status_code, 400)

        res = self.post("/repartitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
                {"proposition": 3, "rank": 30}
            ]
        })
        self.assertEqual(res.status_code, 400)

    def test_only_submit_when_open(self):
        tests = [
            ("CLOSED", 403),
            ("OPEN", 202),
            ("RESULTS", 403),
        ]

        for (status, code) in tests:
            self.login("17bocquet")
            res = self.patch("/repartitions/campaigns/1/", data={"status": status})
            self.assertEqual(res.status_code, 200)

            self.login("15menou")
            res = self.post("/repartitions/1/wishes/", {
                "wishes": [
                    {"proposition": 1, "rank": 1},
                    {"proposition": 2, "rank": 2},
                    {"proposition": 3, "rank": 3}
                ]
            })
            self.assertEqual(res.status_code, code)

    def test_get_repartition(self):
        tests = [
            ("CLOSED", 403),
            ("OPEN", 403),
            ("RESULTS", 200),
        ]

        for (status, code) in tests:
            self.login("17bocquet")
            self.patch("/repartitions/campaigns/1/", data={"status": status})

            res = self.get("/repartitions/1/results/")
            self.assertEqual(res.status_code, code)

            self.login("15menou")
            res = self.get("/repartitions/1/results/")
            self.assertEqual(res.status_code, 403)

            res = self.get("/repartitions/1/results/me")
            self.assertEqual(res.status_code, code)

    @patch("repartitions.views.make_reparition")
    def test_erases_groups_on_status_change(self, mocked_make_repartition):
        campaign = Campaign.objects.get(pk=1)
        proposition = Proposition.objects.get(pk=1)

        def create_group(_):
            group = Group(proposition=proposition, campaign=campaign)
            group.save()

        mocked_make_repartition.side_effect = create_group

        for status in ("CLOSED", "OPEN"):
            self.login("17bocquet")

            self.patch("/repartitions/campaigns/1/", data={"status": "RESULTS"})

            res = self.get("/repartitions/1/results/")
            self.assertEqual(res.status_code, 200)
            self.assertJSONEqual(res.content, [{"proposition": 1, "users": []}])

            # Erase the group

            self.patch("/repartitions/campaigns/1/", data={"status": status})
            self.assertEqual(Group.objects.filter(campaign=campaign).count(), 0)
