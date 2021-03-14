import hashlib
import itertools

PASSWORD_LENGTH = 8


def md5(value):
    return hashlib.md5(value.encode('utf-8')).hexdigest()


def generate_hashes(door_id, padding=5):
    for index in itertools.count(1):
        if (next := md5(door_id + str(index))).startswith('0' * padding):
            yield next


def part1(input):
    return ''.join(h[5] for h in itertools.islice(generate_hashes(input), PASSWORD_LENGTH))


def part2(input):
    password = [None] * PASSWORD_LENGTH

    for h in generate_hashes(input):
        if (index := int(h[5], 16)) in range(PASSWORD_LENGTH) and password[index] is None:
            password[index] = h[6]
        if not None in password:
            break

    return ''.join(password)
