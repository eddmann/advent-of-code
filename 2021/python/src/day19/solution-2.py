from dataclasses import dataclass
from itertools import combinations
from collections import defaultdict


@dataclass(frozen=True)
class Point3D:
    x: int
    y: int
    z: int

    def __add__(self, other):
        if not isinstance(other, Point3D):
            return NotImplemented
        return Point3D(self.x + other.x, self.y + other.y, self.z + other.z)

    def __mul__(self, other):
        if not isinstance(other, Point3D):
            return NotImplemented
        return Point3D(self.x * other.x, self.y * other.y, self.z * other.z)

    def __sub__(self, other):
        if not isinstance(other, Point3D):
            return NotImplemented
        return Point3D(self.x - other.x, self.y - other.y, self.z - other.z)


# http://www.markronan.com/mathematics/symmetry-corner/the-rotations-of-a-cube/
rotations = [
    lambda p: Point3D(p.x, p.y, p.z),
    lambda p: Point3D(p.x, p.z, -p.y),
    lambda p: Point3D(p.x, -p.y, -p.z),
    lambda p: Point3D(p.x, -p.z, p.y),
    lambda p: Point3D(p.y, p.x, -p.z),
    lambda p: Point3D(p.y, p.z, p.x),
    lambda p: Point3D(p.y, -p.x, p.z),
    lambda p: Point3D(p.y, -p.z, -p.x),
    lambda p: Point3D(p.z, p.x, p.y),
    lambda p: Point3D(p.z, p.y, -p.x),
    lambda p: Point3D(p.z, -p.x, -p.y),
    lambda p: Point3D(p.z, -p.y, p.x),
    lambda p: Point3D(-p.x, p.y, -p.z),
    lambda p: Point3D(-p.x, p.z, p.y),
    lambda p: Point3D(-p.x, -p.y, p.z),
    lambda p: Point3D(-p.x, -p.z, -p.y),
    lambda p: Point3D(-p.y, p.x, p.z),
    lambda p: Point3D(-p.y, p.z, -p.x),
    lambda p: Point3D(-p.y, -p.x, -p.z),
    lambda p: Point3D(-p.y, -p.z, p.x),
    lambda p: Point3D(-p.z, p.x, -p.y),
    lambda p: Point3D(-p.z, p.y, p.x),
    lambda p: Point3D(-p.z, -p.x, p.y),
    lambda p: Point3D(-p.z, -p.y, -p.x),
]


def parse_scanner_reports(input):
    return [[Point3D(*map(int, beacon.split(',')))
             for beacon in scanner.split('\n') if beacon[1] != '-']
            for scanner in input.split('\n\n')]


def max_coord_distance(point1, point2):
    diff = point1 - point2
    return max(abs(diff.x), abs(diff.y), abs(diff.z))


def manhattan_distance(point1, point2):
    diff = point1 - point2
    return abs(diff.x) + abs(diff.y) + abs(diff.z)


def fingerprint(point1, point2):
    return (manhattan_distance(point1, point2), max_coord_distance(point1, point2))


def find_match(known_beacons, known_fingerprints, report, report_fingerprints):
    matching_fingerprints = [(fingerprint, report_pair)
                             for (fingerprint, report_pair) in report_fingerprints
                             if fingerprint in known_fingerprints]

    if len(matching_fingerprints) < 66:
        return None

    for (fingerprint, report_pair) in matching_fingerprints:
        for known_pair in known_fingerprints[fingerprint]:
            kp1, kp2 = known_pair
            rp1, rp2 = report_pair

            for rotation in rotations:
                translated = kp1 - rotation(rp1)

                if translated != kp2 - rotation(rp2):
                    continue

                num_matches = 0
                transformed_report = [rotation(p) + translated for p in report]

                for transformed_beacon in transformed_report:
                    if transformed_beacon in known_beacons:
                        num_matches += 1

                    if num_matches >= 3:
                        return (translated, transformed_report)


def map_beacons(reports):
    first_report = reports.pop()
    known_beacons = set(first_report)

    known_fingerprints = defaultdict(list)
    for p1, p2 in combinations(first_report, 2):
        known_fingerprints[fingerprint(p1, p2)].append((p1, p2))

    yield (Point3D(0, 0, 0), first_report)

    reports_with_fingerprints = []
    for report in reports:
        fingerprints = [(fingerprint(p1, p2), (p1, p2))
                        for p1, p2 in combinations(report, 2)]
        reports_with_fingerprints.append((report, fingerprints))

    while reports_with_fingerprints:
        for idx, (report, fingerprints) in enumerate(reports_with_fingerprints):
            if (result := find_match(known_beacons, known_fingerprints, report, fingerprints)):
                yield result
                (_, transformed_report) = result
                for p1, p2 in combinations(transformed_report, 2):
                    known_fingerprints[fingerprint(p1, p2)].append((p1, p2))
                known_beacons.update(transformed_report)
                del reports_with_fingerprints[idx]
                break


def part1(input):
    reports = parse_scanner_reports(input)

    mapped_beacons = set(beacon
                         for (_, beacons) in map_beacons(reports)
                         for beacon in beacons)

    return len(mapped_beacons)


def part2(input):
    reports = parse_scanner_reports(input)

    scanners = [scanner for (scanner, _) in map_beacons(reports)]

    scanner_range = [manhattan_distance(p1, p2)
                     for p1, p2 in combinations(scanners, 2)]

    return max(scanner_range)
