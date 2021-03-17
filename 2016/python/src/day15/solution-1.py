import itertools
import re


def parse_discs(input):
    return [tuple(map(int, re.findall(r'(\d+)', line)))
            for line in input.splitlines()]


def calc_time_for_capsule(discs):
    for time in itertools.count(0):
        if (all((disc_no + start + time) % positions == 0 for (disc_no, positions, _, start) in discs)):
            return time


def part1(input):
    '''
    >>> part1("Disc #1 has 5 positions; at time=0, it is at position 4.\\nDisc #2 has 2 positions; at time=0, it is at position 1.")
    5
    '''

    return calc_time_for_capsule(parse_discs(input))


def part2(input):
    return calc_time_for_capsule(parse_discs(input) + [(7, 11, 0, 0)])
