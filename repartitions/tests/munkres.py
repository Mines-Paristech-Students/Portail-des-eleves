import json
from math import ceil

import numpy as np
from nose.tools import raises

from associations.tests.base_test import BaseTestCase
from authentication.models import User
from repartitions.algorithm import get_project_index
from repartitions.models import Proposition, Campaign, UserCampaign, Category, Wish


class MunkresTestCase(BaseTestCase):

    fixtures = ["authentication.yaml", "test_repartition_api.yaml"]

    def test_get_project_index(self):
        self.assertEqual(4, get_project_index(5, [1, 1, 1, 1, 1]))
        self.assertEqual(1, get_project_index(5, [3, 3, 3]))
        self.assertEqual(0, get_project_index(0, [1, 3, 3]))
        self.assertEqual(1, get_project_index(1, [1, 3, 3]))
        self.assertEqual(2, get_project_index(0, [0, 0, 3]))
        self.assertEqual(5, get_project_index(1, [0, 0, 1, 0, 0, 1]))

    def generate_batch_wishes(self, n_groups=10, n_students=168):
        np.random.seed(0)

        campaign = Campaign(name="Batch campaign", manager_id="17bocquet")
        campaign.save()

        propositions = []
        for i in range(n_groups):
            proposition = Proposition(
                campaign_id=campaign.id,
                name="proposition_{}".format(i),
                number_of_places=int(ceil(n_students / n_groups)),
            )
            proposition.save()
            propositions.append(proposition)

        categories = []
        for name in ["category_{}".format(i) for i in range(4)]:
            category = Category(name=name, campaign=campaign)
            category.save()
            categories.append(category)

        user_campaigns = []
        for i in range(n_students):
            user = User(
                id="19user{}".format(i),
                first_name="firstname {}".format(i),
                last_name="lastname {}".format(i),
                year_of_entry=2019,
                email="email{}@mpt.fr".format(i),
            )
            user.save()

            category = np.random.choice(categories, 1, p=[0.8, 0.1, 0.06, 0.04])[0]
            uc = UserCampaign(user=user, campaign=campaign, category=category)
            uc.save()
            user_campaigns.append(uc)

            if i < 157:  # simulate that a few users didn't answer the form
                for (rank, proposition) in enumerate(
                    np.random.permutation(propositions)
                ):
                    wish = Wish(user_campaign=uc, proposition=proposition, rank=rank)
                    wish.save()

        return campaign, propositions, categories, user_campaigns

    def test_reparition_is_even(self):
        campaign, _, categories, _ = self.generate_batch_wishes()
        self.login("17bocquet")
        self.patch(
            "/repartitions/campaigns/{}/".format(campaign.id),
            data={"status": "RESULTS"},
        )

        res = self.get("/repartitions/{}/results/".format(campaign.id))
        self.assertEqual(res.status_code, 200)
        groups = json.loads(res.content)

        # Checks that categories are evenly shared
        counts = {category.id: [] for category in categories}
        for group in groups:
            count = {category.id: 0 for category in categories}
            for user in group["users"]:
                count[user["category"]["id"]] = count.get(user["category"]["id"], 0) + 1

            for k in counts.keys():
                counts[k].append(count[k])

        for c in counts.values():
            m, M = min(c), max(c)
            self.assertLessEqual(M - m, 1)

        # Checks that all groups have about the same number of people in them
        user_count = [len(group["users"]) for group in groups]
        m, M = min(user_count), max(user_count)
        self.assertLessEqual(M - m, 1)

    def test_respects_fixity(self):
        campaign, propositions, _, user_campaigns = self.generate_batch_wishes()
        campaign.manager = User.objects.get(pk="17bocquet")
        campaign.save()

        users_to_fix = 9
        uc_to_fix = np.random.choice(user_campaigns, users_to_fix, replace=False)
        propositions_to_fix = np.random.choice(propositions, users_to_fix, replace=True)

        expectations = {}
        for (uc, proposition) in zip(uc_to_fix, propositions_to_fix):
            if proposition.id not in expectations:
                expectations[proposition.id] = []
            expectations[proposition.id].append(uc.user.id)

            uc.fixed_to = proposition
            uc.save()

        self.login("17bocquet")
        self.patch(
            "/repartitions/campaigns/{}/".format(campaign.id),
            data={"status": "RESULTS"},
        )

        self.login("17bocquet")
        res = self.get("/repartitions/{}/results/".format(campaign.id))
        self.assertEqual(res.status_code, 200)
        groups = json.loads(res.content)

        for group in groups:
            to_find = expectations[group["proposition"]]
            for user in group["users"]:
                if user["id"] in to_find:
                    to_find.remove(user["id"])
            self.assertEqual(len(to_find), 0)

    @raises(Exception)
    def test_impossible_fixity(self):
        """ Fixes to many users to allow the algorithm to find a repartition with the same (+/- 1) number of users
        per group """
        campaign, propositions, categories, user_campaigns = self.generate_batch_wishes(
            2, 5
        )

        campaign.manager = User.objects.get(pk="17bocquet")
        campaign.save()

        categories_uc = {}

        for uc in user_campaigns:
            categories_uc[uc.category.id] = categories_uc.get(uc.category.id, []) + [uc]

        for i in range(3):
            uc = categories_uc[2][i]
            uc.fixed_to = propositions[0]
            uc.save()

        self.login("17bocquet")
        self.patch(
            "/repartitions/campaigns/{}/".format(campaign.id),
            data={"status": "RESULTS"},
        )
