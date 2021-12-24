import copy
import json
import heapq


AMPHIPOD_ENERGY_COST = {'A': 1, 'B': 10, 'C': 100, 'D': 1000}
ROOM_POSITION = {'A': 2, 'B': 4, 'C': 6, 'D': 8}


def parse_diagram(input):
    lines = input.splitlines()
    hallway = [hall for hall in lines[1][1:-1]]
    room_lines = [[room for room in line if room.isalpha()]
                  for line in lines[2:-1]]
    rooms = list(map(list, zip(*room_lines)))
    return (hallway, rooms)


def next_hallway_moves(state, per_room):
    hallway, rooms = state

    for hall_pos, amphipod in enumerate(hallway):
        if amphipod == '.':
            continue

        target_room = 'ABCD'.index(amphipod)
        room_occupancy = len(rooms[target_room])

        if room_occupancy == per_room:
            continue

        if room_occupancy > 0 and any(pod != amphipod for pod in rooms[target_room]):
            continue

        curr_pos = hall_pos

        step = 1 if ROOM_POSITION[amphipod] > hall_pos else -1
        energy_used = 0
        is_collision = False

        while curr_pos != ROOM_POSITION[amphipod]:
            curr_pos += step
            energy_used += AMPHIPOD_ENERGY_COST[amphipod]
            if hallway[curr_pos] != '.':
                is_collision = True
                break
        if is_collision:
            continue

        energy_used += (per_room - room_occupancy) * \
            AMPHIPOD_ENERGY_COST[amphipod]

        next_hallway = copy.deepcopy(hallway)
        next_hallway[hall_pos] = '.'

        next_rooms = copy.deepcopy(rooms)
        next_rooms[target_room] = [amphipod, *next_rooms[target_room]]

        yield (energy_used, (next_hallway, next_rooms))


def next_room_moves(state, per_room):
    hallway, rooms = state

    for room_idx, room in enumerate(rooms):
        if not room:
            continue

        room_amphipods = 'ABCD'[room_idx]

        if all(pod == room_amphipods for pod in room):
            continue

        steps = (per_room - len(room)) + 1
        next_moves = []

        # Move left
        left_steps = steps
        curr_pos = ROOM_POSITION[room_amphipods] - 1
        while curr_pos >= 0:
            if hallway[curr_pos] != '.':
                break
            left_steps += 1
            if curr_pos not in ROOM_POSITION.values():
                next_moves.append([curr_pos, left_steps])
            curr_pos -= 1

        # Move right
        right_steps = steps
        curr_pos = ROOM_POSITION[room_amphipods] + 1
        while curr_pos < len(hallway):
            if hallway[curr_pos] != '.':
                break
            right_steps += 1
            if curr_pos not in ROOM_POSITION.values():
                next_moves.append([curr_pos, right_steps])
            curr_pos += 1

        for hall_pos, steps in next_moves:
            next_hallway = copy.deepcopy(hallway)
            next_rooms = copy.deepcopy(rooms)

            amphipod = next_rooms[room_idx].pop(0)
            next_hallway[hall_pos] = amphipod

            yield (steps * AMPHIPOD_ENERGY_COST[amphipod], (next_hallway, next_rooms))


def next_moves(state, per_room):
    yield from next_hallway_moves(state, per_room)
    yield from next_room_moves(state, per_room)


def is_amphipods_organised(state, per_room):
    _, rooms = state
    return rooms == [['A'] * per_room, ['B'] * per_room,
                     ['C'] * per_room, ['D'] * per_room]


def least_energy_to_organise(initial_state):
    least_energy_used = {}
    queue = [(0, initial_state)]

    per_room = len(initial_state[1][0])

    while queue:
        energy, state = heapq.heappop(queue)

        if is_amphipods_organised(state, per_room):
            return energy

        for move_energy, next_state in next_moves(state, per_room):
            state_hash = json.dumps(next_state)
            updated_energy = energy + move_energy

            if state_hash not in least_energy_used or updated_energy < least_energy_used[state_hash]:
                least_energy_used[state_hash] = updated_energy
                heapq.heappush(queue, (updated_energy, next_state))


def part1(input):
    diagram = parse_diagram(input)
    return least_energy_to_organise(diagram)


def part2(input):
    unfolded_input = input[:input.find('  #')] + \
        '#D#C#B#A#\n#D#B#A#C#\n' + \
        input[input.find('  #'):]

    diagram = parse_diagram(unfolded_input)
    return least_energy_to_organise(diagram)
