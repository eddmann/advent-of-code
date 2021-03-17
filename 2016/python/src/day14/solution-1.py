import re
import hashlib
import itertools
import functools


def nth(iterable, n, default=None):
    return next(itertools.islice(iterable, n, None), default)


@functools.cache
def md5(value, stretch=0):
    for _ in range(stretch + 1):
        value = hashlib.md5(value.encode('utf-8')).hexdigest()
    return value


def generate_keys(hasher, salt):
    for index in itertools.count(1):
        if (triple := re.search(r'(\w)\1\1', hasher(salt + str(index)))):
            quintuple = triple.group(1) * 5
            if (any(quintuple in hasher(salt + str(next_index))
                    for next_index in range(index + 1, index + 1001))):
                yield index


def part1(input):
    return nth(generate_keys(md5, input), 63)


def part2(input):
    return nth(generate_keys(functools.partial(md5, stretch=2016), input), 63)
