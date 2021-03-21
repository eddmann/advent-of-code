def chunks(l, n):
    for i in range(0, len(l), n):
        yield l[i:i + n]


def is_triangle(triplet):
    a, b, c = sorted(triplet)
    return a + b > c


def parse_triplets(input):
    return [[int(n) for n in line.split()] for line in input.splitlines()]


def part1(input):
    '''
    >>> part1("""101 301 501
    ...          102 302 502
    ...          103 303 503
    ...          201 401 601
    ...          202 402 602
    ...          203 403 603""")
    3
    '''

    return sum(is_triangle(triplet) for triplet in parse_triplets(input))


def part2(input):
    '''
    >>> part2("""101 301 501
    ...          102 302 502
    ...          103 303 503
    ...          201 401 601
    ...          202 402 602
    ...          203 403 603""")
    6
    '''

    return sum(is_triangle(triplet) for col in zip(*parse_triplets(input)) for triplet in chunks(col, 3))
