
def parse_measurements(input):
    return [int(measurement) for measurement in input.splitlines()]


def part1(input):
    '''
    >>> part1('199\\n200\\n208\\n210\\n200\\n207\\n240\\n269\\n260\\n263')
    7
    '''

    measurements = parse_measurements(input)
    return sum(b > a for a, b in zip(measurements, measurements[1:]))


def part2(input):
    '''
    >>> part2('199\\n200\\n208\\n210\\n200\\n207\\n240\\n269\\n260\\n263')
    5
    '''

    measurements = parse_measurements(input)
    windows = [sum(window) for window in zip(
        measurements, measurements[1:], measurements[2:])]
    return sum(b > a for a, b in zip(windows, windows[1:]))
