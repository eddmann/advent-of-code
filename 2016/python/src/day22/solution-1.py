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
    nodes = parse_nodes(input)

    def is_viable_pair(a, b):
        return (a['used'] > 0 and b['free'] >= a['used']) or (b['used'] > 0 and a['free'] >= b['used'])

    return len([(a, b) for a, b in itertools.combinations(nodes, 2) if is_viable_pair(a, b)])


def part2(input):
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
