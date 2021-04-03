import collections
import re
import math


def parse_values(instructions):
    return [(int(val.group(1)), val.group(2))
            for line in instructions
            if (val := re.match(r'value (\d+) goes to (bot \d+)', line))]


def parse_allocations(instructions):
    return [alloc.groups()
            for line in instructions
            if (alloc := re.match(r'(bot \d+) gives low to (\w+ \d+) and high to (\w+ \d+)', line))]


def setup_bins(allocations):
    bins = collections.defaultdict(lambda: lambda x: x)

    def config_bot(low_recipient, high_recipient):
        def awaiting_first_chip(a):
            def awaiting_second_chip(b):
                l, h = sorted((a, b))
                bins[low_recipient] = bins[low_recipient](l)
                bins[high_recipient] = bins[high_recipient](h)
                return (l, h)
            return awaiting_second_chip
        return awaiting_first_chip

    for bot, low, high in allocations:
        bins[bot] = config_bot(low, high)

    return bins


def part1(input):
    instructions = input.splitlines()
    bins = setup_bins(parse_allocations(instructions))

    for val, bot in parse_values(instructions):
        bins[bot] = bins[bot](val)

    return next(bot for bot, allocated in bins.items() if allocated == (17, 61))


def part2(input):
    instructions = input.splitlines()
    bins = setup_bins(parse_allocations(instructions))

    for val, bot in parse_values(instructions):
        bins[bot] = bins[bot](val)

    return math.prod(bins['output {}'.format(i)] for i in range(3))
