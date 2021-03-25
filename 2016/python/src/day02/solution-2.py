DIRECTIONS = {'U': 0+-1j, 'D': 0+1j, 'L': -1+0j, 'R': 1+0j}


def generate_keypad(input):
    return {complex(x, y): key
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
