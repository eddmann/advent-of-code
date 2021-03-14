from collections import Counter


def part1(input):
    return ''.join(Counter(col).most_common()[0][0] for col in zip(*input.splitlines()))


def part2(input):
    return ''.join(Counter(col).most_common()[-1][0] for col in zip(*input.splitlines()))
