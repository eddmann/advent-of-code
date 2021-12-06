from collections import deque, Counter

NEW_BORN_TIMER = 9


def simulate_days(input, days):
    freq = Counter(map(int, input.split(',')))
    fish = deque(freq[day] for day in range(NEW_BORN_TIMER))

    for _ in range(days):
        spawn = fish.popleft()
        fish[-2] += spawn
        fish.append(spawn)

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
