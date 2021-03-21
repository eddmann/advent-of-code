import re
import itertools
import collections
from enum import Enum, auto


def parse_nodes(input):
    def parse_node(line):
        match = re.search(
            r'x(?P<x>\d+)-y(?P<y>\d+)\s+(?P<size>\d+)T\s+(?P<used>\d+)T\s+(?P<free>\d+)T', line)
        return {k: int(v) for k, v in match.groupdict().items()} if match else None

    return [node for line in input.splitlines() if (node := parse_node(line)) != None]


class NodeState(Enum):
    FULL = auto()
    EMPTY = auto()
    MOVEABLE = auto()

    @classmethod
    def parse(cls, node, empty_node_size):
        if node['used'] > empty_node_size:
            return cls.FULL
        return cls.EMPTY if node['used'] == 0 else cls.MOVEABLE


def part1(input):
    '''
    >>> part1("""Filesystem            Size  Used  Avail  Use%
    ...          /dev/grid/node-x0-y0   10T    8T     2T   80%
    ...          /dev/grid/node-x0-y1   11T    6T     5T   54%
    ...          /dev/grid/node-x0-y2   32T   28T     4T   87%
    ...          /dev/grid/node-x1-y0    9T    7T     2T   77%
    ...          /dev/grid/node-x1-y1    8T    0T     8T    0%
    ...          /dev/grid/node-x1-y2   11T    7T     4T   63%
    ...          /dev/grid/node-x2-y0   10T    6T     4T   60%
    ...          /dev/grid/node-x2-y1    9T    8T     1T   88%
    ...          /dev/grid/node-x2-y2    9T    6T     3T   66%""")
    7
    '''

    nodes = parse_nodes(input)

    def is_viable_pair(a, b):
        return (a['used'] > 0 and b['free'] >= a['used']) or (b['used'] > 0 and a['free'] >= b['used'])

    return len([(a, b) for a, b in itertools.combinations(nodes, 2) if is_viable_pair(a, b)])


def part2(input):
    '''
    >>> part2("""Filesystem            Size  Used  Avail  Use%
    ...          /dev/grid/node-x0-y0   10T    8T     2T   80%
    ...          /dev/grid/node-x0-y1   11T    6T     5T   54%
    ...          /dev/grid/node-x0-y2   32T   28T     4T   87%
    ...          /dev/grid/node-x1-y0    9T    7T     2T   77%
    ...          /dev/grid/node-x1-y1    8T    0T     8T    0%
    ...          /dev/grid/node-x1-y2   11T    7T     4T   63%
    ...          /dev/grid/node-x2-y0   10T    6T     4T   60%
    ...          /dev/grid/node-x2-y1    9T    8T     1T   88%
    ...          /dev/grid/node-x2-y2    9T    6T     3T   66%""")
    7
    '''

    nodes = parse_nodes(input)

    (empty_node_position, empty_node_size) = next(
        ((node['x'], node['y']), node['size']) for node in nodes if node['used'] == 0)

    max_x = max(node['x'] for node in nodes)
    data_node_position = next(
        (node['x'], node['y']) for node in nodes if node['x'] == max_x and node['y'] == 0)

    grid = {(node['x'], node['y']): NodeState.parse(node, empty_node_size)
            for node in nodes}

    queue = collections.deque([(empty_node_position, 0)])
    visited = set([empty_node_position])

    while queue:
        ((x, y), steps) = queue.popleft()

        if ((x, y) == data_node_position):
            '''
            ._G | .G_  .G.  .G.  .G.  _G.
            ... | ...  .._  ._.  _..  ...
            '''
            free_node_steps_to_data = steps
            total_data_free_node_moves_to_target = (
                data_node_position[0] - 1) * 5
            return free_node_steps_to_data + total_data_free_node_moves_to_target

        for (dx, dy) in [[-1, 0], [1, 0], [0, -1], [0, 1]]:
            nposition = (x + dx, y + dy)
            if (grid.get(nposition) == NodeState.MOVEABLE and nposition not in visited):
                visited.add(nposition)
                queue.append((nposition, steps + 1))
