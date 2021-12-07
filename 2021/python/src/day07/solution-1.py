def parse_crab_positions(input):
    return [int(c) for c in input.split(',')]


def triangle_number(n):
    return (n * n + 1) // 2


def part1(input):
    '''
    >>> part1('16,1,2,0,4,2,7,1,2,14')
    37
    '''

    crabs = parse_crab_positions(input)
    return min([sum(abs(c - p) for c in crabs)
                for p in range(1, max(crabs) + 1)])


def part2(input):
    '''
    >>> part2('16,1,2,0,4,2,7,1,2,14')
    149
    '''

    crabs = parse_crab_positions(input)
    return min([sum(triangle_number(abs(c - p)) for c in crabs)
                for p in range(1, max(crabs) + 1)])
