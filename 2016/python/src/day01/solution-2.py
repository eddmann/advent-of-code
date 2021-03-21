import collections
import operator


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

    dir = collections.deque([(0, 1), (1, 0), (0, -1), (-1, 0)])
    pos = (0, 0)

    for turn, steps in parse_instructions(input):
        dir.rotate(1 if turn == 'R' else -1)
        pos = tuple(map(lambda p, d: p + d * steps, pos, dir[0]))

    return sum(map(abs, pos))


def part2(input):
    '''
    >>> part2('R8, R4, R4, R8')
    4
    '''

    dir = collections.deque([(0, 1), (1, 0), (0, -1), (-1, 0)])
    pos = (0, 0)
    seen = {pos}

    for turn, steps in parse_instructions(input):
        dir.rotate(1 if turn == 'R' else -1)
        for _ in range(steps):
            pos = tuple(map(operator.add, pos, dir[0]))
            if (pos in seen):
                return sum(map(abs, pos))
            seen.add(pos)

    raise Exception('No repeated position')
