from collections import Counter


def parse_diagnostic_report(input):
    return [int(value, 2) for value in input.splitlines()]


def max_bit_width(diagnostic_report):
    return max(diagnostic_report).bit_length() - 1


def common_bit(diagnostic_report, bit_position, most_common):
    bit_counter = Counter((value >> bit_position) & 1
                          for value in diagnostic_report)
    tie_breaker = sorted(
        bit_counter.most_common(),
        key=lambda b: (-b[1], -b[0]) if most_common else (b[1], b[0]))
    return tie_breaker[0][0]


def part1(input):
    '''
    >>> part1('00100\\n11110\\n10110\\n10111\\n10101\\n01111\\n00111\\n11100\\n10000\\n11001\\n00010\\n01010')
    198
    '''

    diagnostic_report = parse_diagnostic_report(input)

    gamma_rate, epsilon_rate = 0, 0

    for bit_position in range(max_bit_width(diagnostic_report), -1, -1):
        if common_bit(diagnostic_report, bit_position, most_common=True):
            gamma_rate |= 1 << bit_position
        else:
            epsilon_rate |= 1 << bit_position

    return gamma_rate * epsilon_rate


def part2(input):
    '''
    >>> part2('00100\\n11110\\n10110\\n10111\\n10101\\n01111\\n00111\\n11100\\n10000\\n11001\\n00010\\n01010')
    230
    '''

    oxygen_generator_ratings = parse_diagnostic_report(input)
    co2_scrubber_ratings = parse_diagnostic_report(input)

    for bit_position in range(max_bit_width(oxygen_generator_ratings), -1, -1):
        oxygen_bit = common_bit(oxygen_generator_ratings, bit_position,
                                most_common=True)
        oxygen_generator_ratings = [value for value in oxygen_generator_ratings
                                    if (value >> bit_position) & 1 == oxygen_bit]

        co2_bit = common_bit(co2_scrubber_ratings, bit_position,
                             most_common=False)
        co2_scrubber_ratings = [value for value in co2_scrubber_ratings
                                if (value >> bit_position) & 1 == co2_bit]

    return oxygen_generator_ratings[0] * co2_scrubber_ratings[0]
