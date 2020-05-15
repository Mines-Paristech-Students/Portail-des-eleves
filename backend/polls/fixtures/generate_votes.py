from random import randint, sample

"""
Generate the vote fixtures.
"""


if __name__ == "__main__":
    voters = [
        "14alarro",
        "15veaux",
        "16leroy",
        # "17bocquet",
        "17wan-fat",
        "18aouir",
        # "19simple",
        "19bde",
        "19library-bde",
        "19membre-bde",
        "19biero",
        "19market-biero",
        "19membre-biero",
    ]

    number_of_polls = 12
    number_of_choices_per_poll = 2
    number_of_voters_per_poll = 11

    assert number_of_voters_per_poll <= len(voters)

    number_of_votes = 0

    for poll_index in range(1, number_of_polls + 1):
        for voter in sample(voters, number_of_voters_per_poll):
            print(
                f"""- model: polls.Vote
  pk: {number_of_votes + 1}
  fields:
    poll: {poll_index}
    user: "{voter}"
    choice: {2 * poll_index - randint(0, 1)}\n"""
            )
            number_of_votes += 1
