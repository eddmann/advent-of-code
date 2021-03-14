from functools import reduce
import re


def empty_screen(width=50, height=6):
    return [[False] * width for _ in range(height)]


def rect(screen, width, height):
    rect = [(x, y) for y in range(height) for x in range(width)]
    return [[(x, y) in rect or col for x, col in enumerate(row)]
            for y, row in enumerate(screen)]


def rotate_row(screen, rowY, step):
    return [[screen[y][(x - step) % len(screen[rowY])] if y == rowY else col for x, col in enumerate(row)]
            for y, row in enumerate(screen)]


def rotate_col(screen, colX, step):
    return [[screen[(y - step) % len(screen)][colX] if x == colX else col for x, col in enumerate(row)]
            for y, row in enumerate(screen)]


def apply(screen, instruction):
    action, * \
        args = re.match(
            r'(rect|rotate (?:r|c))[^\d]+(\d+)[^\d]+(\d+)', instruction).groups()
    args = map(int, args)

    if action == 'rect':
        return rect(screen, *args)
    if action == 'rotate r':
        return rotate_row(screen, *args)
    if action == 'rotate c':
        return rotate_col(screen, *args)

    raise Exception('Unable to handle {}'.format(action))


def part1(input):
    screen = reduce(apply, input.splitlines(), empty_screen())
    return sum(c for r in screen for c in r)


def part2(input):
    screen = reduce(apply, input.splitlines(), empty_screen())
    return '\n'.join(''.join('#' if c else '.' for c in r) for r in screen)
