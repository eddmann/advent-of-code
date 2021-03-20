from day12.operations import *


def out(execution, x):
    yield resolve(execution, x)
    execution['pointer'] += 1
