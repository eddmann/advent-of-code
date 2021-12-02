

def parse_course(input):
    return [(parts[0], int(parts[1]))
            for action in input.splitlines()
            if (parts := action.split(' '))]


def part1(input):
    '''
    >>> part1('forward 5\\ndown 5\\nforward 8\\nup 3\\ndown 8\\nforward 2')
    150
    '''

    horizontal, depth = 0, 0

    for (move, times) in parse_course(input):
        if move == 'forward':
            horizontal += times
        if move == 'up':
            depth -= times
        if move == 'down':
            depth += times

    return horizontal * depth


def part2(input):
    '''
    >>> part2('forward 5\\ndown 5\\nforward 8\\nup 3\\ndown 8\\nforward 2')
    900
    '''

    horizontal, depth, aim = 0, 0, 0

    for (move, times) in parse_course(input):
        if move == 'forward':
            horizontal += times
            depth += aim * times
        if move == 'up':
            aim -= times
        if move == 'down':
            aim += times

    return horizontal * depth
