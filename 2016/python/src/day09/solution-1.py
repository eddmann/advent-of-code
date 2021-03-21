import re


def decompressed_length(file, acc):
    if not file:
        return 0

    marker = re.match(r"^\((\d+)x(\d+)\)", file)
    if marker:
        length, times = map(int, marker.groups())
        start, end = marker.end(), marker.end() + length
        return times * acc(file[start:end]) + decompressed_length(file[end:], acc)

    return 1 + decompressed_length(file[1:], acc)


def part1(input):
    '''
    >>> part1('ADVENT')
    6
    >>> part1('A(1x5)BC')
    7
    >>> part1('(3x3)XYZ')
    9
    >>> part1('X(8x2)(3x3)ABCY')
    18
    '''

    return decompressed_length(input, len)


def part2(input):
    '''
    >>> part2('(3x3)XYZ')
    9
    >>> part2('X(8x2)(3x3)ABCY')
    20
    >>> part2('(27x12)(20x12)(13x14)(7x10)(1x12)A')
    241920
    >>> part2('(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN')
    445
    '''

    def recursive_len(file):
        return decompressed_length(file, recursive_len)

    return decompressed_length(input, recursive_len)
