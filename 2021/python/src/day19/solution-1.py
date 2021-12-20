from itertools import product, combinations


def parse_scanners(input):
    return [set(tuple(map(int, beacon.split(',')))
                for beacon in scanner.split('\n') if beacon[1] != '-')
            for scanner in input.split('\n\n')]


# http://www.markronan.com/mathematics/symmetry-corner/the-rotations-of-a-cube/
orientations = [
    lambda x, y, z: (x, y, z),
    lambda x, y, z: (x, z, -y),
    lambda x, y, z: (x, -y, -z),
    lambda x, y, z: (x, -z, y),
    lambda x, y, z: (y, x, -z),
    lambda x, y, z: (y, z, x),
    lambda x, y, z: (y, -x, z),
    lambda x, y, z: (y, -z, -x),
    lambda x, y, z: (z, x, y),
    lambda x, y, z: (z, y, -x),
    lambda x, y, z: (z, -x, -y),
    lambda x, y, z: (z, -y, x),
    lambda x, y, z: (-x, y, -z),
    lambda x, y, z: (-x, z, y),
    lambda x, y, z: (-x, -y, z),
    lambda x, y, z: (-x, -z, -y),
    lambda x, y, z: (-y, x, z),
    lambda x, y, z: (-y, z, -x),
    lambda x, y, z: (-y, -x, -z),
    lambda x, y, z: (-y, -z, x),
    lambda x, y, z: (-z, x, -y),
    lambda x, y, z: (-z, y, x),
    lambda x, y, z: (-z, -x, y),
    lambda x, y, z: (-z, -y, -x),
]


def map_beacons(mapped_beacons, scanner):
    for orientation in orientations:
        orientated_beacons = [orientation(*beacon) for beacon in scanner]

        distances = [(x1 - x2, y1 - y2, z1 - z2)
                     for (x1, y1, z1), (x2, y2, z2) in product(mapped_beacons, orientated_beacons)]

        for (dx, dy, dz) in distances:
            offset_beacons = set((x + dx, y + dy, z + dz)
                                 for (x, y, z) in orientated_beacons)
            if len(mapped_beacons & offset_beacons) >= 12:
                mapped_beacons |= offset_beacons
                return (dx, dy, dz)

    return None


def part1(input):
    '''
    >>> part1(open("/app/src/day19/test-input.txt").read())
    79
    '''

    scanners = parse_scanners(input)
    mapped_beacons = scanners.pop(0)

    while scanners:
        for idx, scanner in enumerate(scanners):
            if map_beacons(mapped_beacons, scanner):
                del scanners[idx]

    return len(mapped_beacons)


def part2(input):
    '''
    >>> part2(open("/app/src/day19/test-input.txt").read())
    3621
    '''

    scanners = parse_scanners(input)
    mapped_beacons = scanners.pop(0)
    distances = []

    while scanners:
        for idx, scanner in enumerate(scanners):
            if distance := map_beacons(mapped_beacons, scanner):
                distances.append(distance)
                del scanners[idx]

    return max(
        sum(abs(a - b) for a, b in zip(d1, d2))
        for d1, d2 in combinations(distances, 2)
    )
