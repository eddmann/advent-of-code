def build_octopus_grid(input):
    return {(x, y): int(energy)
            for x, row in enumerate(input.splitlines())
            for y, energy in enumerate(row)}


def get_neighbours(grid, octopus):
    x, y = octopus
    directions = [
        (-1, 0), (1, 0), (0, -1), (0, 1),
        (1, 1), (1, -1), (-1, 1), (-1, -1),
    ]
    return [(x + dx, y + dy)
            for (dx, dy) in directions
            if (x + dx, y + dy) in grid]


def step(grid):
    for octopus in grid:
        grid[octopus] += 1

    while any(grid[octopus] > 9 for octopus in grid):
        for octopus in grid:
            if grid[octopus] <= 9:
                continue
            grid[octopus] = 0
            for n_octopus in get_neighbours(grid, octopus):
                if grid[n_octopus] == 0:
                    continue
                grid[n_octopus] += 1

    return grid


def part1(input):
    '''
    >>> part1(open("/app/src/day11/test-input.txt").read())
    1656
    '''

    grid = build_octopus_grid(input)
    total_flashes = 0

    for _ in range(100):
        grid = step(grid)
        total_flashes += sum(grid[octopus] == 0 for octopus in grid)

    return total_flashes


def part2(input):
    '''
    >>> part2(open("/app/src/day11/test-input.txt").read())
    195
    '''

    grid = build_octopus_grid(input)
    total_steps = 0

    while not all(grid[octopus] == 0 for octopus in grid):
        grid = step(grid)
        total_steps += 1

    return total_steps
