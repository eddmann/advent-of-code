from functools import cache
from itertools import product
from re import findall


def deterministic_dice(rolls):
    dice = 0
    while True:
        score = 0
        for _ in range(rolls):
            dice = (dice + 1 - 1) % 100 + 1
            score += dice
        yield score


quantum_die_scores = list(
    map(sum, product(range(1, 4), range(1, 4), range(1, 4))))


@cache
def play_quantum_die(active_pos, next_pos, active_score=0, next_score=0):
    global quantum_die_scores

    if (active_score >= 21):
        return (1, 0)
    if (next_score >= 21):
        return (0, 1)

    active_wins = 0
    next_wins = 0

    for die in quantum_die_scores:
        n_active_pos = (active_pos + die - 1) % 10 + 1
        (n_next_wins, n_active_wins) = play_quantum_die(
            next_pos, n_active_pos, next_score, active_score + n_active_pos)
        next_wins += n_next_wins
        active_wins += n_active_wins

    return (active_wins, next_wins)


def part1(input):
    '''
    >>> part1('Player 1 starting position: 4\\nPlayer 2 starting position: 8\\n')
    739785
    '''

    p1_pos, p2_pos = map(int, findall('[0-9]+\n', input))
    p1_score, p2_score = 0, 0
    dice, total_dice_rolls = deterministic_dice(rolls=3), 0

    while p1_score < 1000 and p2_score < 1000:
        p1_pos = (p1_pos + next(dice) - 1) % 10 + 1
        total_dice_rolls += 3
        p1_score += p1_pos

        if p1_score >= 1000:
            continue

        p2_pos = (p2_pos + next(dice) - 1) % 10 + 1
        total_dice_rolls += 3
        p2_score += p2_pos

    return min(p1_score, p2_score) * total_dice_rolls


def part2(input):
    '''
    >>> part2('Player 1 starting position: 4\\nPlayer 2 starting position: 8\\n')
    444356092776315
    '''

    player_positions = map(int, findall('[0-9]+\n', input))
    return max(play_quantum_die(*player_positions))
