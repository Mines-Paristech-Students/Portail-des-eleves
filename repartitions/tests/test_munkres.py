import json

import numpy as np

from authentication.models import User
from backend.tests_utils import BaseTestCase
from repartitions.algorithm import get_project_index
from repartitions.models import Proposition, Campaign, UserCampaign, Category, Wish


class MunkresTestCase(BaseTestCase):
    """ The repartition algorithm is named 'Munkres algorithm' or 'Hungarian algorithm' """

    fixtures = ["authentication.yaml", "test_repartition_api.yaml"]

    def test_get_project_index(self):
        self.assertEqual(4, get_project_index(5, [1, 1, 1, 1, 1]))
        self.assertEqual(1, get_project_index(5, [3, 3, 3]))
        self.assertEqual(0, get_project_index(0, [1, 3, 3]))
        self.assertEqual(1, get_project_index(1, [1, 3, 3]))
        self.assertEqual(2, get_project_index(0, [0, 0, 3]))
        self.assertEqual(5, get_project_index(1, [0, 0, 1, 0, 0, 1]))

    def generate_batch_wishes(self, n_propositions=10, n_students=168):
        """ Creates a campaign with propositions, users, and 4 categories in which the students are distributed with
        the probabilities 0.8, 0.1, 0.06, 0.04 """

        np.random.seed(0)

        campaign = Campaign(name="Batch campaign", manager_id="17bocquet")
        campaign.save()

        propositions = []
        for i in range(n_propositions):
            proposition = Proposition(
                campaign_id=campaign.id,
                name="proposition_{}".format(i),
                # number_of_places=int(ceil(n_students / n_propositions)), TODO: remove this or restore it in the model.
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

        self.check_reparition_is_event(campaign, categories)

    def check_reparition_is_event(self, campaign, categories):
        res = self.get("/repartitions/{}/results/".format(campaign.id))
        print(res.content)
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
            if group["proposition"] not in expectations:
                self.assertIn(group["proposition"], map(lambda p: p.id, propositions))
                continue

            to_find = expectations[group["proposition"]]
            for uc in group["users"]:
                if uc["user"] in to_find:
                    to_find.remove(uc["user"])
            self.assertEqual(len(to_find), 0)

    def test_crash_on_impossible_fixity(self):
        """ Fixes too many users to allow the algorithm to find a repartition with the same (+/- 1) number of users
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

        def crash(self):
            self.login("17bocquet")
            self.patch(
                "/repartitions/campaigns/{}/".format(campaign.id),
                data={"status": "RESULTS"},
            )

        self.assertRaises(IndexError, crash, self)

    def test_crash_on_subtle_impossible_fixity(self):
        """ Fixes to many users to allow the algorithm to find a repartition with the same (+/- 1) number of users
        per group """
        campaign, propositions, categories, user_campaigns = self.generate_batch_wishes(
            2, 6
        )

        campaign.manager = User.objects.get(pk="17bocquet")
        campaign.save()

        categories_uc = {}

        i = 0
        for uc in user_campaigns:
            if i < 3:
                uc.category = categories[0]
            else:
                uc.category = categories[1]
            uc.save()
            categories_uc[uc.category.id] = categories_uc.get(uc.category.id, []) + [uc]
            i += 1

        for i in range(2):
            uc = categories_uc[2][i]
            print(uc.user)
            uc.fixed_to = propositions[0]
            uc.save()

        for i in range(2):
            uc = categories_uc[3][i]
            print(uc.user)
            uc.fixed_to = propositions[0]
            uc.save()

        def crash(self):
            self.login("17bocquet")
            self.patch(
                "/repartitions/campaigns/{}/".format(campaign.id),
                data={"status": "RESULTS"},
            )

        self.assertRaises(IndexError, crash, self)

    def test_subtle_impossible_fixity(self):
        """ Fixes to many users to allow the algorithm to find a repartition with the same (+/- 1) number of users
        per group """
        campaign, propositions, categories, user_campaigns = self.generate_batch_wishes(
            2, 6
        )

        campaign.manager = User.objects.get(pk="17bocquet")
        campaign.save()

        categories_uc = {}

        i = 0
        for uc in user_campaigns:
            if i < 3:
                uc.category = categories[0]
            else:
                uc.category = categories[1]
            uc.save()
            categories_uc[uc.category.id] = categories_uc.get(uc.category.id, []) + [uc]
            i += 1

        for i in range(2):
            uc = categories_uc[2][i]
            print(uc.user)
            uc.fixed_to = propositions[0]
            uc.save()

        for i in range(2):
            uc = categories_uc[3][i]
            print(uc.user)
            uc.fixed_to = propositions[0]
            uc.save()

        def crash(self):
            self.login("17bocquet")
            self.patch(
                "/repartitions/campaigns/{}/".format(campaign.id),
                data={"status": "RESULTS"},
            )

        self.assertRaises(IndexError, crash, self)

    def test_can_forcast_over_allocation(self):
        """
           category 1 - 3 users:
                2 users in group 1
                1 user in group 2
            category 2 - 1 user:
                1 user fixed in group 1
            BOUM
        """
        campaign, propositions, categories, user_campaigns = self.generate_batch_wishes(
            2, 4
        )
        campaign.manager = User.objects.get(pk="17bocquet")
        campaign.save()
        Wish.objects.all().delete()

        categories_uc = {}

        i = 0
        for uc in user_campaigns:
            if i < 3:
                uc.category = categories[0]
            else:
                uc.category = categories[1]
            uc.save()
            categories_uc[uc.category.id] = categories_uc.get(uc.category.id, []) + [uc]
            i += 1

            for j, proposition in enumerate(propositions):
                wish = Wish(user_campaign=uc, proposition=proposition, rank=j)
                wish.save()

            print(uc.user, uc.category.id)

        uc = categories_uc[categories[1].id][0]
        uc.fixed_to = propositions[0]
        uc.save()

        print(propositions)

        self.login("17bocquet")
        self.patch(
            "/repartitions/campaigns/{}/".format(campaign.id),
            data={"status": "RESULTS"},
        )

        self.check_reparition_is_event(campaign, categories)
