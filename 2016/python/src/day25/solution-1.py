import itertools
import day25.operations as operations


def parse_instructions(input):
    return [tuple(instruction.split(' ')) for instruction in input.splitlines()]


def execute(instructions, initial_registers):
    execution = {'pointer': 0, 'registers': initial_registers}

    while execution['pointer'] < len(instructions):
        op, *args = instructions[execution['pointer']]
        out = getattr(operations, op)(execution, *args)
        if out != None:
            yield from out

    return execution['registers']


def part1(input):
    for a in itertools.count(0):
        out = list(itertools.islice(
            execute(parse_instructions(input), {'a': a, 'b': 0, 'c': 0, 'd': 0}), 8))
        if (out == [0, 1] * 4):
            return a
