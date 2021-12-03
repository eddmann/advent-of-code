from collections import Counter


def parse_diagnostic_report(input):
    return [list(value) for value in input.splitlines()]


def to_int(value):
    return int(''.join(value), 2)


def bit_count(diagnostic_report, bit_position):
    bits = [value[bit_position] for value in diagnostic_report]
    counter = Counter(bits)
    return (counter.get('0'), counter.get('1'))


def part1(input):
    '''
    >>> part1('00100\\n11110\\n10110\\n10111\\n10101\\n01111\\n00111\\n11100\\n10000\\n11001\\n00010\\n01010')
    198
    '''

    diagnostic_report = parse_diagnostic_report(input)

    gamma_rate = [Counter(x).most_common()[0][0]
                  for x in map(list, zip(*diagnostic_report))]
    epsilon_rate = ['0' if bit == '1' else '1' for bit in gamma_rate]

    return to_int(gamma_rate) * to_int(epsilon_rate)


def part2(input):
    '''
    >>> part2('00100\\n11110\\n10110\\n10111\\n10101\\n01111\\n00111\\n11100\\n10000\\n11001\\n00010\\n01010')
    230
    '''

    oxygen_ratings = parse_diagnostic_report(input)
    co2_ratings = parse_diagnostic_report(input)

    for bit_position in range(len(oxygen_ratings[0])):
        if len(oxygen_ratings) > 1:
            (zeros, ones) = bit_count(oxygen_ratings, bit_position)
            oxygen_ratings = list(filter(
                lambda v: v[bit_position] == ('0' if zeros > ones else '1'), oxygen_ratings))

        if len(co2_ratings) > 1:
            (zeros, ones) = bit_count(co2_ratings, bit_position)
            co2_ratings = list(filter(
                lambda v: v[bit_position] == ('1' if zeros > ones else '0'), co2_ratings))

    assert(len(oxygen_ratings) == 1)
    assert(len(co2_ratings) == 1)

    return to_int(oxygen_ratings[0]) * to_int(co2_ratings[0])
