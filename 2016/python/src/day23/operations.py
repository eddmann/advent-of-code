from day12.operations import *


def tgl(execution, x):
    offset = execution['pointer'] + resolve(execution, x)

    if (0 <= offset < len(execution['instructions'])):
        op, *args = execution['instructions'][offset]

        if (len(args) == 1):
            execution['instructions'][offset] = (
                'dec' if op == 'inc' else 'inc', *args)
        else:
            execution['instructions'][offset] = (
                'cpy' if op == 'jnz' else 'jnz', *args)

    execution['pointer'] += 1


def mul(execution, x, y):
    execution['registers'][x] *= resolve(execution, y)
    execution['pointer'] += 1


def nop(execution):
    execution['pointer'] += 1
