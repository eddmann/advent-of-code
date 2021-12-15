import heapq


def build_cavern_grid(input):
    return [list(map(int, row)) for row in input.splitlines()]


def get_neighbours(grid, position, scale):
    directions = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    row, col = position
    size = len(grid) * scale - 1
    return [(row + drow, col + dcol)
            for (drow, dcol) in directions
            if 0 <= (row + drow) <= size and 0 <= (col + dcol) <= size]


def risk_level(grid, position):
    row, col = position
    size = len(grid)
    risk = ((row // size) + (col // size) + grid[row % size][col % size]) % 9
    return 9 if risk == 0 else risk


def calc_lowest_risk(grid, scale=1):
    risk_levels = {(0, 0): 0}
    queue = [(0, (0, 0))]

    while queue:
        risk, position = heapq.heappop(queue)

        for nposition in get_neighbours(grid, position, scale):
            nrisk = risk + risk_level(grid, nposition)
            if nposition not in risk_levels or nrisk < risk_levels[nposition]:
                risk_levels[nposition] = nrisk
                heapq.heappush(queue, (nrisk, nposition))

    return risk_levels[(scale * len(grid) - 1, scale * len(grid) - 1)]


def part1(input):
    grid = build_cavern_grid(input)
    return calc_lowest_risk(grid)


def part2(input):
    grid = build_cavern_grid(input)
    return calc_lowest_risk(grid, scale=5)
