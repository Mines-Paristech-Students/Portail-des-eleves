import json
from associations.tests.base_test import BaseTestCase


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

        res = self.post("/repartitions/campaigns/", {"name": "MIGs groups"}) # recreate a new campaign
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
        for status in ["CLOSED", "OPENED", "RESULTS"]:
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

        res = self.get("/repatitions/1/users/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.content), {
            "users": [
                {"id": "17bocquet", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "15menou", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "18chlieh", "wishes": [], "category": "Everyone", "fixed_to": None},
            ]
        })

        res = self.post("/repatitions/1/users/", {"id": "17wan-fat", "category": "Everyone"})
        self.assertEqual(res.status_code, 200)
        res = self.get("/repatitions/1/users/")  # Check that the user was added
        self.assertEqual(json.loads(res.content), {
            "users": [
                {"id": "17bocquet", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "15menou", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "18chlieh", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "17wan-fat", "wishes": [], "category": "Everyone", "fixed_to": None},
            ]
        })

        res = self.delete("/repatitions/1/users/17wan-fat")
        self.assertEqual(res.status_code, 200)
        res = self.get("/repatitions/1/users/")  # Check that the user was removed
        self.assertEqual(json.loads(res.content), {
            "users": [
                {"id": "17bocquet", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "15menou", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "18chlieh", "wishes": [], "category": "Everyone", "fixed_to": None},
            ]
        })

        # For a non admin

        self.login("15menou")
        res = self.get("/repatitions/1/users/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.content), {
            "users": [
                {"id": "17bocquet"},
                {"id": "15menou"},
                {"id": "18chlieh"},
            ]
        })

        res = self.post("/repatitions/1/users/", {"id": "17wan-fat", "category": "Everyone"})
        self.assertEqual(res.status_code, 403)

        res = self.delete("/repatitions/1/users/17wan-fat")
        self.assertEqual(res.status_code, 403)

    def test_fix_user(self):
        self.login("17bocquet")

        res = self.post("/repatitions/1/users/", {"id": "15menou", "category": "Everyone", "fixed_to": 1})
        self.assertEqual(res.status_code, 200)
        res = self.get("/repatitions/1/users/")  # Check that the user was added
        self.assertEqual(json.loads(res.content), {
            "users": [
                {"id": "17bocquet", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "15menou", "wishes": [], "category": "Everyone", "fixed_to": 1},
                {"id": "18chlieh", "wishes": [], "category": "Everyone", "fixed_to": None},
            ]
        })

        res = self.post("/repatitions/1/users/", {"id": "15menou", "category": "Everyone"})
        self.assertEqual(res.status_code, 200)
        res = self.get("/repatitions/1/users/")  # Check that the user was added
        self.assertEqual(json.loads(res.content), {
            "users": [
                {"id": "17bocquet", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "15menou", "wishes": [], "category": "Everyone", "fixed_to": None},
                {"id": "18chlieh", "wishes": [], "category": "Everyone", "fixed_to": None},
            ]
        })

    def test_submit_wishes(self):
        self.login("17bocquet")
        self.patch("/repartitions/1/", data={"status": "OPEN"})

        self.login("15menou")

        # good request

        res = self.post("/repatitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
                {"proposition": 3, "rank": 3}
            ]
        })
        self.assertEqual(res.status_code, 200)

        res = self.get("/repatitions/1/wishes/")  # Check that the user was added
        self.assertEqual(json.loads(res.content), {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
                {"proposition": 3, "rank": 3}
            ]
        })

        # bad requests

        res = self.post("/repatitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
            ]
        })
        self.assertEqual(res.status_code, 400)

        res = self.post("/repatitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
                {"proposition": 2, "rank": 3}
            ]
        })
        self.assertEqual(res.status_code, 400)

        res = self.post("/repatitions/1/wishes/", {
            "wishes": [
                {"proposition": 1, "rank": 1},
                {"proposition": 2, "rank": 2},
                {"proposition": 3, "rank": 1}
            ]
        })
        self.assertEqual(res.status_code, 400)

        res = self.post("/repatitions/1/wishes/", {
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
            ("OPENED", 200),
            ("RESULTS", 403),
        ]

        for (status, code) in tests:
            self.login("17bocquet")
            self.patch("/repartitions/1/", data={"status": status})

            self.login("15menou")
            res = self.post("/repatitions/1/wishes/", {
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
            ("OPENED", 403),
            ("RESULTS", 200),
        ]

        for (status, code) in tests:
            self.login("17bocquet")
            self.patch("/repartitions/1/", data={"status": status})

            res = self.get("/repatitions/1/results/")
            self.assertEqual(res.status_code, code)

            self.login("15menou")
            res = self.get("/repatitions/1/results/")
            self.assertEqual(res.status_code, 403)

            res = self.get("/repatitions/1/results/me")
            self.assertEqual(res.status_code, code)
