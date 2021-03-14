from operator import add

DIRECTIONS = {'U': (0, -1), 'D': (0, 1), 'L': (-1, 0), 'R': (1, 0)}


def generate_keypad(input):
    return {(x, y): key
            for y, line in enumerate(input.splitlines())
            for x, key in enumerate(line.split())
            if key != '.'}


def part1(input):
    keypad = generate_keypad("""1 2 3
                                4 5 6
                                7 8 9""")

    pos = (0, 0)
    code = ''

    for line in input.splitlines():
        for command in line:
            if ((next_pos := tuple(map(add, pos, DIRECTIONS[command]))) in keypad):
                pos = next_pos
        code += keypad[pos]

    return code


def part2(input):
    keypad = generate_keypad(""". . 1 . .
                                . 2 3 4 .
                                5 6 7 8 9
                                . A B C .
                                . . D . .""")

    pos = next(pos for pos, key in keypad.items() if key == "5")
    code = ''

    for line in input.splitlines():
        for command in line:
            if ((next_pos := tuple(map(add, pos, DIRECTIONS[command]))) in keypad):
                pos = next_pos
        code += keypad[pos]

    return code
