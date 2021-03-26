from dataclasses import dataclass


@dataclass(frozen=True)
class Point2D:
    x: int
    y: int

    def __add__(self, other):
        if not isinstance(other, Point2D):
            return NotImplemented
        return Point2D(self.x + other.x, self.y + other.y)


DIRECTIONS = {'U': Point2D(0, -1), 'D': Point2D(0, 1),
              'L': Point2D(-1, 0), 'R': Point2D(1, 0)}


def generate_keypad(input):
    return {Point2D(x, y): key
            for y, line in enumerate(input.splitlines())
            for x, key in enumerate(line.split())
            if key != '.'}


def calc_keycode(keypad, initial_key, instructions):
    pos = next(pos for pos, key in keypad.items() if key == initial_key)
    code = ''

    for instruction in instructions:
        for direction in instruction:
            if ((next_pos := pos + DIRECTIONS[direction]) in keypad):
                pos = next_pos
        code += keypad[pos]

    return code


def part1(input):
    '''
    >>> part1("ULL\\nRRDDD\\nLURDL\\nUUUUD")
    '1985'
    '''

    keypad = generate_keypad("""1 2 3
                                4 5 6
                                7 8 9""")

    return calc_keycode(keypad, initial_key="5", instructions=input.splitlines())


def part2(input):
    '''
    >>> part2("ULL\\nRRDDD\\nLURDL\\nUUUUD")
    '5DB3'
    '''

    keypad = generate_keypad(""". . 1 . .
                                . 2 3 4 .
                                5 6 7 8 9
                                . A B C .
                                . . D . .""")

    return calc_keycode(keypad, initial_key="5", instructions=input.splitlines())
