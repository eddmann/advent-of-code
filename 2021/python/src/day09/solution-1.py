def build_heightmap(input):
    return {(x, y): int(height)
            for x, row in enumerate(input.splitlines())
            for y, height in enumerate(row)}


def get_neighbours(point):
    x, y = point
    return [
        (x - 1, y),
        (x + 1, y),
        (x, y - 1),
        (x, y + 1)
    ]


def find_basin(heightmap, low_point):
    from collections import deque

    queue = deque([low_point])
    basin = set()

    while queue:
        point = queue.popleft()
        if heightmap[point] == 9:
            continue
        basin.add(point)
        queue.extend(npoint
                     for npoint in get_neighbours(point)
                     if npoint in heightmap and npoint not in basin)

    return basin


def low_points(heightmap):
    return [point for point in heightmap
            if heightmap[point] < min(heightmap[npoint] for npoint in get_neighbours(point) if npoint in heightmap)]


def part1(input):
    '''
    >>> part1("2199943210\\n3987894921\\n9856789892\\n8767896789\\n9899965678")
    15
    '''

    heightmap = build_heightmap(input)
    return sum(heightmap[point] + 1 for point in low_points(heightmap))


def part2(input):
    '''
    >>> part2("2199943210\\n3987894921\\n9856789892\\n8767896789\\n9899965678")
    1134
    '''

    heightmap = build_heightmap(input)
    basins = sorted(len(find_basin(heightmap, point))
                    for point in low_points(heightmap))
    return basins[-1] * basins[-2] * basins[-3]
