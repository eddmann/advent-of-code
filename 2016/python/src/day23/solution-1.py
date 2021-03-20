import day23.operations as operations


def parse_instructions(input):
    return [tuple(instruction.split(' ')) for instruction in input.splitlines()]


def optimise_multiplication(instructions):
    start = instructions.index(('cpy', 'a', 'd'))
    end = instructions.index(('jnz', 'd', '-5'))
    return instructions[:start] + [('nop',)] * (end - start) + [('mul', 'a', 'b')] + instructions[end + 1:]


def execute(instructions, initial_registers):
    execution = {'pointer': 0,
                 'registers': initial_registers,
                 'instructions': optimise_multiplication(instructions)}

    while execution['pointer'] < len(execution['instructions']):
        op, *args = execution['instructions'][execution['pointer']]
        getattr(operations, op)(execution, *args)

    return execution['registers']


def part1(input):
    return execute(parse_instructions(input), {'a': 7, 'b': 0, 'c': 0, 'd': 0})['a']


def part2(input):
    return execute(parse_instructions(input), {'a': 12, 'b': 0, 'c': 0, 'd': 0})['a']
