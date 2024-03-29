from collections import Counter
from itertools import zip_longest


def parse_hydrothermal_vents(input):
    return [tuple(tuple(map(int, coord.split(','))) for coord in vent.split(' -> '))
            for vent in input.splitlines()]


def intermediate_steps(vent):
    ((x1, y1), (x2, y2)) = vent

    dx = x2 - x1
    dy = y2 - y1

    offset_x = range(0, dx + 1 if dx > 0 else dx - 1, 1 if dx > 0 else -1)
    offset_y = range(0, dy + 1 if dy > 0 else dy - 1, 1 if dy > 0 else -1)

    return [(x1 + ox, y1 + oy)
            for (ox, oy) in zip_longest(offset_x, offset_y, fillvalue=0)]


def count_overlapping_vents(vents):
    overlaps = Counter(
        step for vent in vents for step in intermediate_steps(vent))
    return sum(count > 1 for count in overlaps.values())


def is_straight_line(vent):
    ((x1, y1), (x2, y2)) = vent
    return x1 == x2 or y1 == y2


def part1(input):
    '''
    >>> part1(open('/app/src/day05/test-input.txt').read())
    5
    '''

    hydrothermal_vents = parse_hydrothermal_vents(input)
    straight_lines = filter(is_straight_line, hydrothermal_vents)
    return count_overlapping_vents(straight_lines)


def part2(input):
    '''
    >>> part2(open('/app/src/day05/test-input.txt').read())
    12
    '''

    return count_overlapping_vents(parse_hydrothermal_vents(input))
