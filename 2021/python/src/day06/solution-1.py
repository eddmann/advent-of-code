NEW_BORN_TIMER = 9
NEW_BORN_DAY = 7


def simulate_days(input, days):
    fish = [0] * NEW_BORN_TIMER
    for f in input.split(','):
        fish[int(f)] += 1

    for day in range(days):
        fish[(day + NEW_BORN_DAY) % NEW_BORN_TIMER] += fish[day % NEW_BORN_TIMER]

    return sum(fish)


def part1(input):
    '''
    >>> part1('3,4,3,1,2')
    5934
    '''

    return simulate_days(input, 80)


def part2(input):
    '''
    >>> part2('3,4,3,1,2')
    26984457539
    '''

    return simulate_days(input, 256)
