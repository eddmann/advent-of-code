import collections
import itertools
import hashlib


def md5(value):
    return hashlib.md5(value.encode('utf-8')).hexdigest()


def open_doors(passcode, directions):
    return itertools.compress(
        [('U', (0, -1)), ('D', (0, 1)), ('L', (-1, 0)), ('R', (1, 0))],
        (int(d, 16) > 10 for d in md5(passcode + directions)[:4])
    )


def vault_access_routes(passcode, start, vault):
    queue = collections.deque([(start, '')])

    while queue:
        (x, y), directions = queue.popleft()

        for direction, (dx, dy) in open_doors(passcode, directions):
            nx, ny = x + dx, y + dy

            if not (0 <= nx < 4 and 0 <= ny < 4):
                continue

            nposition = (nx, ny)
            ndirections = directions + direction

            if (nposition == vault):
                yield ndirections
                continue

            queue.append((nposition, ndirections))


def part1(input):
    '''
    >>> part1('ihgpwlah')
    'DDRRRD'
    >>> part1('kglvqrro')
    'DDUDRLRRUDRD'
    >>> part1('ulqzkmiv')
    'DRURDRUDDLLDLUURRDULRLDUUDDDRR'
    '''

    return next(vault_access_routes(input, (0, 0), (3, 3)))


def part2(input):
    '''
    >>> part2('ihgpwlah')
    370
    >>> part2('kglvqrro')
    492
    >>> part2('ulqzkmiv')
    830
    '''

    return len(list(vault_access_routes(input, (0, 0), (3, 3)))[-1])
