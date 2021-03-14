import collections
import operator


def parse_instructions(input):
    return [[i[0], int(i[1:])] for i in input.split(', ')]


def part1(input):
    dir = collections.deque([(0, 1), (1, 0), (0, -1), (-1, 0)])
    pos = (0, 0)

    for turn, steps in parse_instructions(input):
        dir.rotate(1 if turn == 'R' else -1)
        pos = tuple(map(lambda p, d: p + d * steps, pos, dir[0]))

    return sum(map(abs, pos))


def part2(input):
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
