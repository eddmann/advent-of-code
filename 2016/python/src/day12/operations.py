def cpy(execution, x, y):
    execution['registers'][y] = resolve(execution, x)
    execution['pointer'] += 1


def inc(execution, x):
    execution['registers'][x] += 1
    execution['pointer'] += 1


def dec(execution, x):
    execution['registers'][x] -= 1
    execution['pointer'] += 1


def jnz(execution, x, y):
    value = resolve(execution, x)
    execution['pointer'] += resolve(execution, y) if value != 0 else 1


def resolve(execution, value):
    return execution['registers'][value] if value in execution['registers'] else int(value)
