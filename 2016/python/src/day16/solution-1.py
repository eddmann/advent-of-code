def random_data(data, length):
    ndata = '{}0{}'.format(data, ''.join(
        '0' if c == '1' else '1' for c in reversed(data)))
    return ndata[:length] if len(ndata) >= length else random_data(ndata, length)


def checksum(data):
    nsum = ''.join(['1' if a == b else '0' for a,
                    b in zip(data[::2], data[1::2])])
    return nsum if len(nsum) % 2 != 0 else checksum(nsum)


def part1(input):
    '''
    >>> part1('10000')
    '11010011110011010'
    '''

    return checksum(random_data(input, 272))


def part2(input):
    '''
    >>> part2('10000')
    '10111110011110111'
    '''

    return checksum(random_data(input, 35651584))
