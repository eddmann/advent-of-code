from collections import defaultdict


def build_cave_graph(input):
    graph = defaultdict(list)

    for line in input.splitlines():
        [a, b] = line.split('-')
        graph[a].append(b)
        graph[b].append(a)

    return graph


def count_paths(graph, is_cave_explorable):
    paths, queue = [], [['start']]

    while queue:
        path = queue.pop()

        if path[-1] == 'end':
            paths.append(path)
            continue

        for next in graph[path[-1]]:
            if next != 'start' and is_cave_explorable(path, next):
                queue.append(path + [next])

    return len(paths)


def part1(input):
    '''
    >>> part1("start-A\\nstart-b\\nA-c\\nA-b\\nb-d\\nA-end\\nb-end")
    10
    '''

    graph = build_cave_graph(input)

    def is_cave_explorable(path, next):
        return next.isupper() or next not in path

    return count_paths(graph, is_cave_explorable)


def part2(input):
    '''
    >>> part2("start-A\\nstart-b\\nA-c\\nA-b\\nb-d\\nA-end\\nb-end")
    36
    '''

    graph = build_cave_graph(input)

    def is_cave_explorable(path, next):
        if next.isupper() or next not in path:
            return True

        small_caves = [c for c in path if c.islower()]
        has_small_duplicate = len(set(small_caves)) != len(small_caves)

        return not has_small_duplicate

    return count_paths(graph, is_cave_explorable)
