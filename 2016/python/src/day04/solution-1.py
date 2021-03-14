import re
import string
from collections import Counter


def decode(name, id):
    az = string.ascii_lowercase
    shift = id % len(az)
    return name.translate(str.maketrans(az, az[shift:] + az[:shift]))


def parse_rooms(input):
    return [(name.replace('-', ''), int(id), checksum)
            for (name, id, checksum) in re.findall(r'([a-z\-]+)(\d+)\[([a-z]+)\]', input)]


def is_real_room(name, checksum):
    generated = ''.join(c for c, _ in sorted(
        Counter(name).most_common(), key=lambda o: (-o[1], o[0])))
    return generated.startswith(checksum)


def part1(input):
    return sum(id for (name, id, checksum) in parse_rooms(input) if is_real_room(name, checksum))


def part2(input):
    return next(id for (name, id, _) in parse_rooms(input) if 'northpole' in decode(name, id))
