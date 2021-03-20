import re
import functools


def swap_position(password, x, y):
    '''
    >>> swap_position('abcde', 4, 0)
    'ebcda'
    '''
    npassword = list(password)
    npassword[x], npassword[y] = npassword[y], npassword[x]
    return ''.join(npassword)


def swap_letter(password, x, y):
    '''
    >>> swap_letter('ebcda', 'd', 'b')
    'edcba'
    '''
    return swap_position(password, password.index(x), password.index(y))


def rotate_steps(password, direction, steps):
    '''
    >>> rotate_steps('abcde', 'left', 1)
    'bcdea'
    >>> rotate_steps('abcde', 'right', 1)
    'eabcd'
    '''
    directed_steps = (steps if direction == 'left' else -steps) % len(password)
    return password[directed_steps:] + password[:directed_steps]


def rotate_steps_back(password, direction, steps):
    return rotate_steps(password, 'left' if direction == 'right' else 'right', steps)


def rotate_letter(password, x):
    '''
    >>> rotate_letter('abdec', 'b')
    'ecabd'
    >>> rotate_letter('ecabd', 'd')
    'decab'
    '''
    index = password.index(x)
    additional = 2 if index >= 4 else 1
    return rotate_steps(password, 'right', index + additional)


def rotate_letter_back(password, x):
    for steps in range(len(password) + 1):
        previous = rotate_steps(password, 'left', steps)
        if rotate_letter(previous, x) == password:
            return previous


def reverse_range(password, x, y):
    '''
    >>> reverse_range('edcba', 0, 4)
    'abcde'
    '''
    return password[:x] + password[y:x:-1] + password[x] + password[y + 1:]


def move_position(password, x, y):
    '''
    >>> move_position('bcdea', 1, 4)
    'bdeac'
    '''
    npassword = list(password)
    npassword.insert(y, npassword.pop(x))
    return ''.join(npassword)


def move_position_back(password, x, y):
    return move_position(password, y, x)


operations = {
    r'swap position (\d+) with position (\d+)': (swap_position, swap_position),
    r'swap letter (\w) with letter (\w)': (swap_letter, swap_letter),
    r'rotate (left|right) (\d+) step': (rotate_steps, rotate_steps_back),
    r'rotate based on position of letter (\w)': (rotate_letter, rotate_letter_back),
    r'reverse positions (\d+) through (\d+)': (reverse_range, reverse_range),
    r'move position (\d+) to position (\d+)': (move_position, move_position_back)
}


def scramble(password, instructions):
    def execute(password, instruction):
        for pattern, (operation, _) in operations.items():
            if (match := re.match(pattern, instruction)):
                args = [int(a) if a.isdigit() else a for a in match.groups()]
                return operation(password, *args)

    return functools.reduce(execute, instructions, password)


def descramble(password, instructions):
    def execute(password, instruction):
        for pattern, (_, operation) in operations.items():
            if (match := re.match(pattern, instruction)):
                args = [int(a) if a.isdigit() else a for a in match.groups()]
                return operation(password, *args)

    return functools.reduce(execute, instructions[::-1], password)


def part1(input):
    return scramble('abcdefgh', input.splitlines())


def part2(input):
    return descramble('fbgdceah', input.splitlines())
