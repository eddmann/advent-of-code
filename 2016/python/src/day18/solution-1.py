from itertools import islice


def parse_row(input):
    return [tile == '.' for tile in input]


def generate_rows(row):
    while True:
        yield row
        padded = [True] + row + [True]
        row = [left == right for left, right in zip(padded, padded[2:])]


def part1(input):
    '''
    >>> part1('..^^.')
    61
    '''

    return sum(sum(row) for row in islice(generate_rows(parse_row(input)), 40))


def part2(input):
    '''
    >>> part2('..^^.')
    600001
    '''

    return sum(sum(row) for row in islice(generate_rows(parse_row(input)), 400000))
