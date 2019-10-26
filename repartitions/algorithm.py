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

    groups = {}

    if len(user_campaigns) > 0:
        places = []
        s = 0  # Nombre de places allouées pour le groupe
        for i in range(len(propositions)):
            n = -already_used[i]
            s += n
            places.append(n)

        while s < len(user_campaigns):
            for i in range(len(places)):
                s += 1
                places[i] += 1

        print("places=", places, end=" ")

        cost_matrix = []
        for uc in user_campaigns:
            cost_matrix.append(generate_line(uc, propositions, places))

        while len(cost_matrix) < len(cost_matrix[0]):
            cost_matrix.append([0] * len(cost_matrix[0]))

        print(np.array(cost_matrix))

        links = linear_sum_assignment(cost_matrix)

        for user_index, place_index in zip(links[0], links[1]):
            if user_index >= len(user_campaigns):
                break

            project_index = get_project_index(place_index, places)
            if (
                project_index not in propositions
                or propositions[project_index].id not in groups
            ):
                groups[propositions[project_index].id] = []

            uc = user_campaigns[user_index]
            groups[propositions[project_index].id].append(uc)

    if len(fixed_user_campaigns) > 0:
        for uc in fixed_user_campaigns:
            if uc.fixed_to.id not in groups:
                groups[uc.fixed_to.id] = []

            groups[uc.fixed_to.id].append(uc)

    res = []
    for proposition in propositions:
        res.append(groups.get(proposition.id, []))

    return res


# Checks the repartition is always even
def make_reparitition_proxy(
    category: Category,
    campaign: Campaign,
    propositions: List[Proposition],
    already_used: List[int],
) -> List[List[User]]:
    group_cardinal_diff = 2
    groups = []

    penalty = [0] * len(already_used)

    while group_cardinal_diff > 1:
        used_places = [0] * len(already_used)
        for i in range(len(already_used)):
            used_places[i] = already_used[i] + penalty[i]
        print("penalty=", penalty, end=" ")
        print("used_places=", np.array(used_places), end=" ")

        groups = make_repartition_for_category(category, propositions, used_places)

        rep = [0] * len(used_places)
        for i in range(len(propositions)):
            rep[i] = len(groups[i])

        group_cardinal = np.array(rep) + np.array(already_used)
        penalty[np.argmax(group_cardinal)] += 1
        print("cardinal=", group_cardinal, "rep=", rep)
        group_cardinal_diff = max(group_cardinal) - min(group_cardinal)

    print("endproxy")
    return groups


def make_reparition(campaign: Campaign) -> List[Group]:
    propositions = Proposition.objects.filter(campaign=campaign).all()

    already_used = [0] * len(propositions)
    store = {}

    categories = Category.objects.filter(campaign=campaign).all()

    for category in categories:
        if category.users_campaign.count() == 0:
            continue
        groups = make_reparitition_proxy(category, campaign, propositions, already_used)

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
