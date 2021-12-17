from itertools import product
from re import findall


def build_target_bounds(input):
    return tuple(map(int, findall(r'[-0-9]+', input)))


def max_height_reached(velocity, target_bounds):
    vel_x, vel_y = velocity
    from_x, to_x, from_y, to_y = target_bounds
    cur_x, cur_y = 0, 0
    max_y = 0

    while cur_x <= to_x and cur_y >= from_y:
        cur_x, cur_y = cur_x + vel_x, cur_y + vel_y
        vel_x, vel_y = max(0, vel_x - 1), vel_y - 1
        max_y = max(max_y, cur_y)

        if from_x <= cur_x <= to_x and from_y <= cur_y <= to_y:
            return max_y

    return None


def is_target_hit(velocity, target_bounds):
    vel_x, vel_y = velocity
    from_x, to_x, from_y, to_y = target_bounds
    cur_x, cur_y = 0, 0

    while cur_x <= to_x and cur_y >= from_y:
        cur_x, cur_y = cur_x + vel_x, cur_y + vel_y
        vel_x, vel_y = max(0, vel_x - 1), vel_y - 1

        if from_x <= cur_x <= to_x and from_y <= cur_y <= to_y:
            return True

    return False


def part1(input):
    '''
    >>> part1('target area: x=20..30, y=-10..-5')
    45
    '''

    target_bounds = build_target_bounds(input)
    velocity_range = product(range(200), range(-200, 200))
    return max(height for velocity in velocity_range
               if (height := max_height_reached(velocity, target_bounds)) is not None)


def part2(input):
    '''
    >>> part2('target area: x=20..30, y=-10..-5')
    112
    '''

    target_bounds = build_target_bounds(input)
    velocity_range = product(range(200), range(-200, 200))
    return sum(is_target_hit(velocity, target_bounds)
               for velocity in velocity_range)
