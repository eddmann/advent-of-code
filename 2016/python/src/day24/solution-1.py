import itertools
import collections
from enum import Enum, auto


class Cell(Enum):
    WALL = auto()
    PATH = auto()
    VISIT = auto()
    START = auto()

    @classmethod
    def parse(cls, cell):
        if (cell == '#'):
            return cls.WALL
        if (cell == '.'):
            return cls.PATH
        if (cell == '0'):
            return cls.START
        return cls.VISIT


def shortest_path_steps(grid, start, goal):
    queue = collections.deque([(start, 0)])
    visited = set([start])

    while queue:
        ((x, y), steps) = queue.popleft()

        if ((x, y) == goal):
            return steps

        for (dx, dy) in [[-1, 0], [1, 0], [0, -1], [0, 1]]:
            nposition = (x + dx, y + dy)
            if (grid.get(nposition) != Cell.WALL and nposition not in visited):
                visited.add(nposition)
                queue.append((nposition, steps + 1))


def parse_grid(input):
    return {(x, y): Cell.parse(value)
            for y, line in enumerate(input.splitlines())
            for x, value in enumerate(line)}


def shortest_path_route_steps(grid, routes):
    costs = collections.defaultdict(dict)

    for (a, b) in itertools.combinations(routes, 2):
        costs[a][b] = costs[b][a] = shortest_path_steps(grid, a, b)

    return costs


def find_cells_to_visit(grid):
    return ([pos for pos, value in grid.items() if value == Cell.VISIT],
            next(pos for pos, value in grid.items() if value == Cell.START))


def part1(input):
    '''
    >>> part1("###########\\n#0.1.....2#\\n#.#######.#\\n#4.......3#\\n###########")
    14
    '''

    grid = parse_grid(input)
    visit, start = find_cells_to_visit(grid)
    route_steps = shortest_path_route_steps(grid, visit + [start])
    routes = [[start, *route] for route in itertools.permutations(visit)]

    return min(sum(route_steps[a][b] for (a, b) in zip(route[0:-1], route[1:]))
               for route in routes)


def part2(input):
    '''
    >>> part2("###########\\n#0.1.....2#\\n#.#######.#\\n#4.......3#\\n###########")
    20
    '''

    grid = parse_grid(input)
    visit, start = find_cells_to_visit(grid)
    route_steps = shortest_path_route_steps(grid, visit + [start])
    routes = [[start, *route, start]
              for route in itertools.permutations(visit)]

    return min(sum(route_steps[a][b] for (a, b) in zip(route[0:-1], route[1:]))
               for route in routes)
