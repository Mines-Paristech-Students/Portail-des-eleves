from django.test import TestCase, Client
import json

from django.urls import reverse
from rest_framework.test import APIClient


class GroupTestCase(TestCase):
    fixtures = ['authentication.yaml', 'associations.json']
    client = APIClient(enforce_csrf_checks=True)

    def logout(self):
        """Log the current user out."""
        self.client.logout()

    def login(self, username, password='password'):
        """
        Log an user in.
        :param str username: the user's username.
        :param str password: the user's password (default: password, should not change)
        :return: the response from token_obtain_pair.
        """

        self.logout()

        url = reverse('token_obtain_pair')
        data = {'id': username, 'password': password}
        return self.client.post(url, data, format='json')

    def test_can_edit_group(self):
        tests = [
            [{
                "id": 1,
                'members': ['15veaux', '17bocquet'],
                "members_detail": [
                    {
                        "id": "15veaux",
                        "first_name": "Florian",
                        "last_name": "Veaux"
                    },
                    {
                        "id": "17bocquet",
                        "first_name": "Adrien",
                        "last_name": "Bocquet"
                    }
                ],
                "role": "Dreamteam",
                "is_admin_group": True,
                "static_page": False,
                "news": False,
                "marketplace": False,
                "library": False,
                "vote": False,
                "events": False
            }],
            (
                [{
                    "id": 1,
                    "role": "VP Geek",
                    "members": ["15veaux"],
                    "is_admin_group": True,
                    "library": False,
                    "marketplace": False,
                    "news": True,
                    "static_page": False,
                    "vote": False
                }],
                [{
                    "id": 1,
                    "members": ["15veaux"],
                    "members_detail": [
                        {
                            "id": "15veaux",
                            "first_name": "Florian",
                            "last_name": "Veaux"
                        }

                    ],
                    "role": "VP Geek",
                    "is_admin_group": True,
                    "static_page": False,
                    "news": True,
                    "marketplace": False,
                    "library": False,
                    "vote": False,
                    "events": False
                }]
            ),
            (
                [
                    {
                        "id": 1,
                        "members": ["15veaux"],
                        "role": "VP Geek",
                        "is_admin_group": True,
                        "static_page": False,
                        "news": True,
                        "marketplace": False,
                        "library": False,
                        "vote": False,
                        "events": False
                    },
                    {
                        "id": 2,
                        "members": ["17bocquet"],
                        "role": "Creperie",
                        "is_admin_group": False,
                        "static_page": False,
                        "news": False,
                        "marketplace": True,
                        "library": False,
                        "vote": False,
                        "events": False
                    }
                ],
                [
                    {
                        "id": 1,
                        "members": ["15veaux"],
                        "members_detail": [
                            {
                                "id": "15veaux",
                                "first_name": "Florian",
                                "last_name": "Veaux"
                            }
                        ],
                        "role": "VP Geek",
                        "is_admin_group": True,
                        "static_page": False,
                        "news": True,
                        "marketplace": False,
                        "library": False,
                        "vote": False,
                        "events": False
                    },
                    {
                        "id": 2,
                        "members": ["17bocquet"],
                        "members_detail": [
                            {
                                "id": "17bocquet",
                                "first_name": "Adrien",
                                "last_name": "Bocquet"
                            }
                        ],
                        "role": "Creperie",
                        "is_admin_group": False,
                        "static_page": False,
                        "news": False,
                        "marketplace": True,
                        "library": False,
                        "vote": False,
                        "events": False
                    },
                ]
            ),
            (
                [
                    {
                        "id": 2,
                        "members": ["17bocquet"],
                        "role": "Creperie",
                        "is_admin_group": False,
                        "static_page": False,
                        "news": False,
                        "marketplace": True,
                        "library": False,
                        "vote": False,
                        "events": False
                    }
                ],
                [
                    {
                        "id": 2,
                        "members": ["17bocquet"],
                        "members_detail": [
                            {
                                "id": "17bocquet",
                                "first_name": "Adrien",
                                "last_name": "Bocquet"
                            }
                        ],
                        "role": "Creperie",
                        "is_admin_group": False,
                        "static_page": False,
                        "news": False,
                        "marketplace": True,
                        "library": False,
                        "vote": False,
                        "events": False
                    }
                ]
            )
        ]

        self.maxDiff = None
        self.login("17bocquet")

        # has the fixture correcly loaded
        response = self.client.get("/api/v1/associations/bde/")
        self.assertEqual(response.status_code, 200)
        response_json = json.loads(response.content)

        self.assertEqual(response_json["groups"], tests[0])

        # can we edit a group
        response = self.client.patch("/api/v1/associations/bde/", json.dumps({"groups": tests[1][0]}), content_type="application/json")

        self.assertEqual(response.status_code, 200)
        response_json = json.loads(response.content)

        self.assertEqual(response_json["groups"], tests[1][1])

        # can we create a group

        response = self.client.patch("/api/v1/associations/bde/", json.dumps({
            "groups": tests[2][0]
        }), content_type="application/json")
        self.assertEqual(response.status_code, 200)

        response_json = json.loads(response.content)
        self.assertEqual(response_json["groups"], tests[2][1])

        response = self.client.get("/api/v1/associations/bde/")
        self.assertEqual(response.status_code, 200)
        response_json = json.loads(response.content)
        self.assertEqual(response_json["groups"], tests[2][1])

        # can we delete a group
        response = self.client.patch("/api/v1/associations/bde/", json.dumps({
            "groups": tests[3][0]
        }), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        response_json = json.loads(response.content)

        self.assertEqual(response_json["groups"], tests[3][1])


