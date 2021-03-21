import operator

COMPASS = [(0, 1), (1, 0), (0, -1), (-1, 0)]


def parse_instructions(input):
    return [[i[0], int(i[1:])] for i in input.split(', ')]


def part1(input):
    '''
    >>> part1('R2, L3')
    5
    >>> part1('R2, R2, R2')
    2
    >>> part1('R5, L5, R5, R3')
    12
    '''

    dir = 0
    pos = (0, 0)

    for turn, steps in parse_instructions(input):
        dir = (dir + (1 if turn == 'R' else -1)) % len(COMPASS)
        pos = tuple(map(lambda p, d: p + d * steps, pos, COMPASS[dir]))

    return sum(map(abs, pos))


def part2(input):
    '''
    >>> part2('R8, R4, R4, R8')
    4
    '''

    dir = 0
    pos = (0, 0)
    seen = {pos}

    for turn, steps in parse_instructions(input):
        dir = (dir + (1 if turn == 'R' else -1)) % len(COMPASS)
        for _ in range(steps):
            pos = tuple(map(operator.add, pos, COMPASS[dir]))
            if (pos in seen):
                return sum(map(abs, pos))
            seen.add(pos)

    raise Exception('No repeated position')
