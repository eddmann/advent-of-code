TURNS = {'R': 0+1j, 'L': 0-1j}


def parse_instructions(input):
    return [[i[0], int(i[1:])] for i in input.split(', ')]


def manhattan_distance(pos):
    return abs(int(pos.real)) + abs(int(pos.imag))


def part1(input):
    dir = 1+0j
    pos = 0+0j

    for turn, steps in parse_instructions(input):
        dir *= TURNS[turn]
        pos += dir * steps

    return manhattan_distance(pos)


def part2(input):
    dir = 1+0j
    pos = 0+0j
    seen = {pos}

    for turn, steps in parse_instructions(input):
        dir *= TURNS[turn]
        for _ in range(steps):
            pos += dir
            if (pos in seen):
                return manhattan_distance(pos)
            seen.add(pos)

    raise Exception('No repeated position')
