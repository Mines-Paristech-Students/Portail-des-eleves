from typing import List

from scipy.optimize import linear_sum_assignment

from authentication.models import User
from repartitions.models import (
    Proposition,
    Wish,
    Category,
    Group,
    Campaign,
    UserCampaign,
)

import numpy as np


def get_project_index(index, places):
    s = 0
    for i in range(len(places)):
        if s <= index < s + places[i]:
            return i
        s += places[i]

    if index == s:
        return len(places) - 1

    raise Exception("should not happend")


def generate_line(
    uc: UserCampaign, propositions: List[Proposition], places: List[int]
) -> List[float]:
    if any(map(lambda x: x < 0, places)):
        raise Exception("places {} is not valid", places)

    wishes = Wish.objects.filter(user_campaign=uc).all()
    map_wishes = {w.proposition.id: w for w in wishes}

    total_number_of_places = 0
    for n in places:
        total_number_of_places += n

    res = [0] * total_number_of_places
    i = 0
    for j, proposition in enumerate(propositions):
        for k in range(places[j]):
            if proposition.id in map_wishes:
                res[i] = map_wishes.get(proposition.id).rank
            else:
                res[i] = 0
            i += 1

    return res


def make_repartition_for_category(
    category: Category, propositions: List[Proposition], already_used: List[int]
) -> List[List[UserCampaign]]:
    raw_users_campaign = category.users_campaign.all()

    if len(raw_users_campaign) == 0:
        raise Exception("No users in given group")
    user_campaigns, fixed_user_campaigns = [], []
    for uc in raw_users_campaign:
        if not uc.fixed_to:
            user_campaigns.append(uc)
        else:
            fixed_user_campaigns.append(uc)

    repartition_cardinal_diff = 2
    penalty = [0] * len(already_used)
    while repartition_cardinal_diff > 1:
        repartition = [[] for _ in propositions]
        proposition_id_to_index = {
            proposition.id: i for i, proposition in enumerate(propositions)
        }

        if len(fixed_user_campaigns) > 0:
            for uc in fixed_user_campaigns:
                repartition[proposition_id_to_index[uc.fixed_to.id]].append(uc)

        if len(user_campaigns) > 0:
            places = []
            s = 0  # Nombre de places allouées pour le groupe
            for i, proposition in enumerate(propositions):
                n = -already_used[i]
                n -= len(repartition)
                n -= penalty[i]
                s += n
                places.append(n)

            while s < len(user_campaigns):
                for i in range(len(places)):
                    s += 1
                    places[i] += 1

            cost_matrix = []
            for uc in user_campaigns:
                cost_matrix.append(generate_line(uc, propositions, places))

            # make the matrix square
            while len(cost_matrix) < len(cost_matrix[0]):
                cost_matrix.append([0] * len(cost_matrix[0]))

            links = linear_sum_assignment(cost_matrix)

            for user_index, place_index in zip(links[0], links[1]):
                if user_index >= len(user_campaigns):
                    break

                project_index = get_project_index(place_index, places)
                uc = user_campaigns[user_index]
                repartition[project_index].append(uc)

            repartition_size = list(map(len, repartition))
            repartition_cardinal_diff = max(repartition_size) - min(repartition_size)

            penalty[np.argmax(repartition_size)] += 1
        else:
            repartition_cardinal_diff = 0  # avoid being stuck in an infinite loop

    print_repartition = []
    for i in repartition:
        print_repartition.append(len(i))

    return repartition


# Checks the repartition is always even
def make_reparitition_proxy(
    category: Category, propositions: List[Proposition], already_used: List[int]
) -> List[List[User]]:
    group_cardinal_diff = 2
    groups = []

    already_used = np.array(already_used)
    penalty = np.array([0] * len(already_used))
    while group_cardinal_diff > 1:
        used_places = already_used + penalty
        groups = make_repartition_for_category(category, propositions, used_places)

        rep = [0] * len(used_places)
        for i in range(len(propositions)):
            rep[i] = len(groups[i])
        group_cardinal = np.array(rep) + already_used
        penalty[np.argmax(group_cardinal)] += 1
        group_cardinal_diff = max(group_cardinal) - min(group_cardinal)

    return groups


def make_reparition(campaign: Campaign) -> List[Group]:
    propositions = list(campaign.propositions.all())
    categories = list(campaign.categories.all())

    already_used = [0] * len(propositions)
    store = {}

    for i in range(len(categories)):
        category = categories[i]

        # todo: remove ?
        # anticipation_penalty = [0] * len(propositions)
        # if i < len(categories) - 1:
        #     next_category = categories[i + 1]
        #     max_users_per_project = np.ceil(
        #         next_category.users_campaign.count() / len(propositions)
        #     )
        #
        #     fixations = {}
        #     for uc in next_category.users_campaign.all():
        #         if uc.fixed_to:
        #             fixations[uc.fixed_to.id] = fixations.get(uc.fixed_to.id, 0) + 1
        #
        #     for i, proposition in enumerate(propositions):
        #         if fixations.get(proposition.id, 0) == max_users_per_project:
        #             anticipation_penalty[i] += 1

        if category.users_campaign.count() == 0:
            continue

        # Check the repartition is feasible
        user_campaigns = category.users_campaign.all()
        fixed_to = {}
        for uc in user_campaigns:
            if uc.fixed_to is not None:
                fixed_to[uc.fixed_to.id] = fixed_to.get(uc.fixed_to.id, 0) + 1

        # if it's not possible for the repartition to compensate the inequalities created by fixity
        if len(fixed_to) > 0 and (max(fixed_to.values()) - 1) * len(propositions) > len(
            user_campaigns
        ):
            raise Exception(
                "Impossible to find an even repartition, {} out of {} users fixed to {}".format(
                    max(fixed_to.values()),
                    category.users_campaign.count(),
                    np.argmax(fixed_to),
                )
            )

        # dispatch users
        groups = make_reparitition_proxy(category, propositions, already_used)

        for i, proposition in enumerate(propositions):
            store[proposition.id] = store.get(proposition.id, []) + groups[i]
            already_used[i] += len(groups[i])
    groups = []
    for proposition_id, users in store.items():

        proposition = Proposition.objects.get(pk=proposition_id)
        group = Group(proposition=proposition, campaign=campaign)
        group.save()
        group.users.set(users)
        groups.append(group)

    return groups
