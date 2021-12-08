from typing import TypeAlias

Pattern: TypeAlias = set
Patterns: TypeAlias = list[Pattern]


def parse_patterns_and_output(input: str) -> list[tuple[Patterns, Patterns]]:
    return [tuple(list(map(set, digit.split(' '))) for digit in line.split(" | "))
            for line in input.splitlines()]


def decode_output(patterns: Patterns, output: Patterns) -> int:
    digit_patterns = {len(pattern): pattern for pattern in patterns}
    one, four = digit_patterns[2], digit_patterns[4]

    def decode(digit: Pattern) -> int:
        match (len(one & digit), len(four & digit), len(digit)):
            case (1, _, 6): return '6'
            case (1, 2, 5): return '2'
            case (1, _, 5): return '5'
            case (2, _, 2): return '1'
            case (2, _, 3): return '7'
            case (2, _, 4): return '4'
            case (2, _, 5): return '3'
            case (2, 3, 6): return '0'
            case (2, _, 6): return '9'
            case (2, _, 7): return '8'
            case _: raise Exception("Unknown digit")

    return int(''.join(map(decode, output)))


def part1(input: str) -> int:
    '''
    >>> part1(open('/app/src/day08/test-input.txt').read())
    26
    '''

    return sum(
        sum(len(digit) in [2, 3, 4, 7] for digit in output)
        for _, output in parse_patterns_and_output(input)
    )


def part2(input: str) -> int:
    '''
    >>> part2(open('/app/src/day08/test-input.txt').read())
    61229
    '''

    return sum(decode_output(patterns, output)
               for patterns, output in parse_patterns_and_output(input))
