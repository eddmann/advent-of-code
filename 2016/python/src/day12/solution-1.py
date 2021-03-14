import day12.operations as operations


def parse_instructions(input):
    return [instruction.split(' ') for instruction in input.splitlines()]


def execute(instructions, initial_registers):
    execution = {'pointer': 0, 'registers': initial_registers}

    while execution['pointer'] < len(instructions):
        op, *args = instructions[execution['pointer']]
        getattr(operations, op)(execution, *args)

    return execution['registers']


def part1(input):
    return execute(parse_instructions(input), {'a': 0, 'b': 0, 'c': 0, 'd': 0})['a']


def part2(input):
    return execute(parse_instructions(input), {'a': 0, 'b': 0, 'c': 1, 'd': 0})['a']
