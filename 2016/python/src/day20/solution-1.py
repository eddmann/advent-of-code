def parse_ranges(input):
    return sorted(tuple(map(int, range.split('-'))) for range in input.splitlines())


def part1(input):
    highest = 0

    for (low, high) in parse_ranges(input):
        if (low - highest > 1):
            return highest + 1
        highest = max(highest, high)


def part2(input):
    highest, allowed = 0, 0

    for (low, high) in parse_ranges(input):
        if (low - highest > 1):
            allowed += low - highest - 1
        highest = max(highest, high)

    allowed += 2 ** 32 - 1 - highest

    return allowed
