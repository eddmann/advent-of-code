import re
from itertools import chain, combinations
from collections import deque, Counter


def parse_floors(input):
    return [set(re.findall(r'(\w+)(?:-compatible)? (microchip|generator)', line)) for line in input.splitlines()]


def is_valid_transition(floor):
    return len(set(type for _, type in floor)) < 2 or all((obj, 'generator') in floor for (obj, type) in floor if type == 'microchip')


def next_states(state):
    moves, elevator, floors = state

    possible_moves = chain(combinations(
        floors[elevator], 2), combinations(floors[elevator], 1))

    for move in possible_moves:
        for direction in [-1, 1]:
            next_elevator = elevator + direction
            if not 0 <= next_elevator < len(floors):
                continue

            next_floors = floors.copy()
            next_floors[elevator] = next_floors[elevator].difference(move)
            next_floors[next_elevator] = next_floors[next_elevator].union(move)

            if (is_valid_transition(next_floors[elevator]) and is_valid_transition(next_floors[next_elevator])):
                yield (moves + 1, next_elevator, next_floors)


def count_floor_objects(state):
    _, elevator, floors = state
    return elevator, tuple(tuple(Counter(type for _, type in floor).most_common()) for floor in floors)


def is_all_top_level(floors):
    return all(not floor for number, floor in enumerate(floors) if number < len(floors) - 1)


def min_moves_to_top_level(floors):
    seen = set()
    queue = deque([(0, 0, floors)])

    while queue:
        state = queue.popleft()
        moves, _, floors = state

        if is_all_top_level(floors):
            return moves

        for next_state in next_states(state):
            if (key := count_floor_objects(next_state)) not in seen:
                seen.add(key)
                queue.append(next_state)


def part1(input):
    return min_moves_to_top_level(parse_floors(input))


def part2(input):
    floors = parse_floors(input)
    floors[0] = floors[0].union([('elerium', 'generator'), ('elerium', 'microchip'),
                                 ('dilithium', 'generator'), ('dilithium', 'microchip')])
    return min_moves_to_top_level(floors)
