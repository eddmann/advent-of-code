from functools import partial
from collections import deque


def next_states(favorite_number, current, _):
    def is_open(x, y):
        result = (x * x + 3 * x + 2 * x * y + y + y * y) + favorite_number
        return bin(result).count('1') % 2 == 0

    cx, cy = current
    return [(nx, ny)
            for dx, dy in [(1, 0), (0, 1), (-1, 0), (0, -1)]
            if (nx := cx + dx) >= 0 and (ny := cy + dy) >= 0 and is_open(nx, ny)]


def part1(input):
    path, _ = bfs(start=(1, 1),
                  goal=(31, 39),
                  next_states=partial(next_states, int(input)))

    return len(path) - 1


def part2(input):
    def capped_next_states(current, path):
        return next_states(int(input), current, path) if len(path) <= 50 else []

    _, visited = bfs(start=(1, 1),
                     goal=None,
                     next_states=capped_next_states)

    return len(visited)


def bfs(start, goal, next_states, is_complete=lambda x, y: x == y):
    visited = set([start])
    queue = deque([(start, [start])])

    while queue:
        current, path = queue.popleft()

        if (is_complete(current, goal)):
            return path, visited

        for next_state in next_states(current, path):
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, path + [current]))

    return None, visited
