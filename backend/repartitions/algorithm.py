from typing import List

from lapsolver import solve_dense

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

"""
The repartition algorithm is based on Munkres algorithm, or "Hungarian" algorithm, which, given a cost matrix, 
returns a pairing between lines and columns that minimises the cost.

The implementation we use here is lapsolver's
https://github.com/cheind/py-lapsolver

However it does more than simply calling Munkres algorithm because we have two additional constraints : 
- we have  "categories" of users ie subsets that have to be mixed inside of each group. For instance if we have 10 users
"A" and 10 users "B" to split into two groups we want to have twice "5 A  + 5 B" instead of one group of all As and one
group of all Bs
- we want groups to be "even" ie we don't want to be more than 1 person of difference between two groups (ex : one group
of 15 people and another of 5 people) nor inside of a group between categories (ex: 2A and 8B in one group and 8A and 2B
 in the other)

To abide by theses constraints, the algorithm is split in 2 stages:
(1) make an even repartition for a category
    determine the number of place necessary for each group
        - if there are n people and m groups, we'll have k places in each group were (k-1) * m < n <= k * m
    
    create the cost matrix
        - one line by user
        - one column per place in group, each column corresponding to one group is identical
        - example : 3 users, and 2 groups => k = 4
            (1, 1) (1, 1) (1, 2) (1, 2) 
            (2, 1) (2, 1) (2, 2) (2, 2)
            (3, 1) (3, 1) (3, 2) (3, 2)
    
    run hungarian algorithm
    
    if there are too many people in one or several group, add a "penalty" to the group which has the most people. This
    is as if one place was removed in this group so on the next iteration it'll have one less person
    
    rerun the algorithm as long as the repartition isn't even
    
(2)  make the repartition even among categories
    repeat step (1) for each category but adding a penalty on each run corresponding to how many people each group has
    more in cumulated (either 0 or 1)

"""


def generate_line(
    uc: UserCampaign, propositions: List[Proposition], places: List[int]
) -> List[float]:
    """ given a user's choices, a list of proposition and the number of places for each proposition, returns the
    corresponding line of the cost matrix """

    if any(map(lambda x: x < 0, places)):
        raise ValueError("places {} is not valid", places)

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


def get_project_index(index, places):
    """ Given an index and the number of places in each proposition, returns the index of the proposition in the
    array given to `generate_line` """
    s = 0
    for i in range(len(places)):
        if s <= index < s + places[i]:
            return i
        s += places[i]

    if index == s:
        return len(places) - 1

    raise ValueError("index is too big considering the number of places")


# noinspection PyTypeChecker
def make_repartition_for_category(
    category: Category, propositions: List[Proposition], already_used: List[int]
) -> List[List[UserCampaign]]:
    raw_users_campaign = category.users_campaign.all()

    if len(raw_users_campaign) == 0:
        raise ValueError("No users in given group")
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

            links = solve_dense(cost_matrix)

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
            repartition_cardinal_diff = (
                0  # there is nothing to do, avoid being stuck in an infinite loop
            )

    return repartition


def make_reparitition_proxy(
    category: Category, propositions: List[Proposition], already_used: List[int]
) -> List[List[User]]:
    """makes repartition for one category and make sure it's even"""
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
            raise RuntimeError(
                "Impossible to find an even repartition, {} out of {} users fixed to {}".format(
                    max(fixed_to.values()),
                    category.users_campaign.count(),
                    np.argmax(fixed_to),
                )
            )

        # dispatch users
        groups = make_reparitition_proxy(category, propositions, already_used)

        for j, proposition in enumerate(propositions):
            store[proposition.id] = store.get(proposition.id, []) + groups[j]
            already_used[j] += len(groups[j])

    groups = []
    for proposition_id, users in store.items():

        proposition = Proposition.objects.get(pk=proposition_id)
        group = Group(proposition=proposition, campaign=campaign)
        group.save()
        group.users.set(users)
        groups.append(group)

    return groups
