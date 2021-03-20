import re
import functools
import itertools


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


operations = {
    r'swap position (\d+) with position (\d+)': swap_position,
    r'swap letter (\w) with letter (\w)': swap_letter,
    r'rotate (left|right) (\d+) step': rotate_steps,
    r'rotate based on position of letter (\w)': rotate_letter,
    r'reverse positions (\d+) through (\d+)': reverse_range,
    r'move position (\d+) to position (\d+)': move_position
}


def scramble(password, instructions):
    def execute(password, instruction):
        for pattern, operation in operations.items():
            if (match := re.match(pattern, instruction)):
                args = [int(a) if a.isdigit() else a for a in match.groups()]
                return operation(password, *args)

    return functools.reduce(execute, instructions, password)


def part1(input):
    return scramble('abcdefgh', input.splitlines())


def part2(input):
    instructions = input.splitlines()
    return next(''.join(password) for password in itertools.permutations('fbgdceah')
                if scramble(password, instructions) == 'fbgdceah')
