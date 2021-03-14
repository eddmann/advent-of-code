import re


def decompressed_length(file, acc):
    if not file:
        return 0

    marker = re.match(r"^\((\d+)x(\d+)\)", file)
    if marker:
        length, times = map(int, marker.groups())
        start, end = marker.end(), marker.end() + length
        return times * acc(file[start:end]) + decompressed_length(file[end:], acc)

    return 1 + decompressed_length(file[1:], acc)


def part1(input):
    return decompressed_length(input, len)


def part2(input):
    def recursive_len(file):
        return decompressed_length(file, recursive_len)

    return decompressed_length(input, recursive_len)
