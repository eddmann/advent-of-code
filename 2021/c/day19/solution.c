#include "../shared/aoc.h"

typedef struct {
  int32_t x, y, z;
} point_t;

typedef struct beacon {
  point_t point;
  struct beacon *next;
} beacon_t;

typedef struct distance {
  bool is_match;
  uint32_t distance;
  beacon_t *from, *to;
  struct distance *next;
} distance_t;

typedef struct scanner {
  bool is_aligned;
  beacon_t *reference_beacons[3];
  point_t position;
  beacon_t *beacons;
  distance_t *distances;
  struct scanner *next;
} scanner_t;

static point_t point_orient(point_t *point, uint8_t orientation) {
  int32_t a = point->x, b = point->y, c = point->z;

  point_t all_orientations[24] = {
      {+a, +b, +c}, {+b, +c, +a}, {+c, +a, +b}, {+c, +b, -a}, {+b, +a, -c},
      {+a, +c, -b}, {+a, -b, -c}, {+b, -c, -a}, {+c, -a, -b}, {+c, -b, +a},
      {+b, -a, +c}, {+a, -c, +b}, {-a, +b, -c}, {-b, +c, -a}, {-c, +a, -b},
      {-c, +b, +a}, {-b, +a, +c}, {-a, +c, +b}, {-a, -b, +c}, {-b, -c, +a},
      {-c, -a, +b}, {-c, -b, -a}, {-b, -a, -c}, {-a, -c, -b}};

  return all_orientations[orientation];
}

static point_t point_subtract(point_t *a, point_t *b) {
  return (point_t){a->x - b->x, a->y - b->y, a->z - b->z};
}

static point_t point_add(point_t *a, point_t *b) {
  return (point_t){a->x + b->x, a->y + b->y, a->z + b->z};
}

static int point_compare(point_t *a, point_t *b) {
  if (a->x < b->x) {
    return -1;
  }

  if (a->x == b->x && a->y < b->y) {
    return -1;
  }

  if (a->x == b->x && a->y == b->y && a->z < b->z) {
    return -1;
  }

  if (a->x == b->x && a->y == b->y && a->z == b->z) {
    return 0;
  }

  return 1;
}

static inline void insert_distance(scanner_t *scanner, distance_t *distance) {
  distance->next = NULL;

  if (scanner->distances == NULL) {
    scanner->distances = distance;
    return;
  }

  distance_t *current = scanner->distances, *previous = NULL;

  while (current != NULL) {
    if (distance->distance < current->distance) {
      if (previous == NULL) {
        scanner->distances = distance;
        distance->next = current;
      } else {
        previous->next = distance;
        distance->next = current;
      }
      return;
    }

    previous = current;
    current = current->next;
  }

  previous->next = distance;
}

static void compute_beacon_distances(scanner_t *scanner, beacon_t *beacon) {
  beacon_t *current = scanner->beacons;

  while (current != NULL) {
    if (current == beacon) {
      current = current->next;
      continue;
    }

    point_t difference = point_subtract(&beacon->point, &current->point);

    distance_t *new_distance = (distance_t *)calloc(1, sizeof(distance_t));
    new_distance->distance = difference.x * difference.x +
                             difference.y * difference.y +
                             difference.z * difference.z;
    new_distance->from = beacon;
    new_distance->to = current;
    new_distance->next = NULL;

    insert_distance(scanner, new_distance);

    current = current->next;
  }
}

static void move_uncommon_beacon_distances(scanner_t *from, scanner_t *to) {
  distance_t *current = from->distances, *next = NULL;

  while (current != NULL) {
    next = current->next;

    if (!current->is_match) {
      insert_distance(to, current);
    } else {
      free(current);
    }

    current = next;
  }

  from->distances = NULL;
}

static bool insert_unseen_beacon(scanner_t *scanner, beacon_t *beacon) {
  beacon->next = NULL;

  if (scanner->beacons == NULL) {
    scanner->beacons = beacon;
    return true;
  }

  beacon_t *current = scanner->beacons, *previous = NULL;

  while (current != NULL) {
    int comparison = point_compare(&beacon->point, &current->point);

    if (comparison == 0) {
      return false;
    }

    if (comparison == -1) {
      if (previous == NULL) {
        scanner->beacons = beacon;
        beacon->next = current;
      } else {
        previous->next = beacon;
        beacon->next = current;
      }
      return true;
    }

    previous = current;
    current = current->next;
  }

  previous->next = beacon;

  return true;
}

static void align_scanner_beacons(scanner_t *scanner, scanner_t *reference) {
  point_t *reference_points[3], *points[3];

  for (uint8_t i = 0; i < 3; i++) {
    reference_points[i] = &reference->reference_beacons[i]->point;
    points[i] = &scanner->reference_beacons[i]->point;
  }

  for (uint8_t orientation = 0; orientation < 24; orientation++) {
    point_t diff[3];

    for (int ref = 0; ref < 3; ref++) {
      diff[ref] = point_orient(points[ref], orientation);
      diff[ref] = point_subtract(reference_points[ref], &diff[ref]);

      if (ref == 0)
        continue;

      if (diff[ref].x != diff[0].x || diff[ref].y != diff[0].y ||
          diff[ref].z != diff[0].z)
        goto next_orientation;
    }

    scanner->position = diff[0];
    scanner->is_aligned = true;

    beacon_t *current = scanner->beacons;
    while (current != NULL) {
      current->point = point_orient(&current->point, orientation);
      current->point = point_add(&current->point, diff);
      current = current->next;
    }

    break;
  next_orientation:
  }
}

static void merge_scanner_beacons(scanner_t *from, scanner_t *to) {
  move_uncommon_beacon_distances(from, to);

  beacon_t *current = from->beacons, *next = NULL;

  while (current != NULL) {
    next = current->next;

    if (!insert_unseen_beacon(to, current))
      free(current);

    current = next;
  }

  from->beacons = NULL;
}

static bool align_reference_beacons(scanner_t *scanner, distance_t *distance) {
  if (distance->from == scanner->reference_beacons[0]) {
    scanner->reference_beacons[2] = distance->to;
    return true;
  }

  else if (distance->from == scanner->reference_beacons[1]) {
    beacon_t *tmp = scanner->reference_beacons[0];
    scanner->reference_beacons[0] = scanner->reference_beacons[1];
    scanner->reference_beacons[1] = tmp;
    scanner->reference_beacons[2] = distance->to;
    return true;
  }

  else if (distance->to == scanner->reference_beacons[0]) {
    scanner->reference_beacons[2] = distance->from;
    return true;
  }

  else if (distance->to == scanner->reference_beacons[1]) {
    beacon_t *tmp = scanner->reference_beacons[0];
    scanner->reference_beacons[0] = scanner->reference_beacons[1];
    scanner->reference_beacons[1] = tmp;
    scanner->reference_beacons[2] = distance->from;
    return true;
  }

  return false;
}

static uint8_t count_common_distances(scanner_t *scanner_a,
                                      scanner_t *scanner_b) {
  if (scanner_a->distances == NULL || scanner_b->distances == NULL)
    return 0;

  distance_t *match = scanner_b->distances;
  while (match != NULL) {
    match->is_match = false;
    match = match->next;
  }

  uint8_t common_distances = 0;
  bool has_reference_pair = false, has_third_reference = false;

  distance_t *current_a = scanner_a->distances;
  distance_t *current_b = scanner_b->distances;

  while (current_a != NULL && current_b != NULL) {
    if (current_a->distance < current_b->distance) {
      current_a = current_a->next;
      continue;
    }

    if (current_a->distance > current_b->distance) {
      current_b = current_b->next;
      continue;
    }

    common_distances += 1;
    current_b->is_match = true;

    if (!has_reference_pair) {
      scanner_a->reference_beacons[0] = current_a->from;
      scanner_a->reference_beacons[1] = current_a->to;
      scanner_b->reference_beacons[0] = current_b->from;
      scanner_b->reference_beacons[1] = current_b->to;
      has_reference_pair = true;
    } else if (!has_third_reference) {
      has_third_reference = align_reference_beacons(scanner_a, current_a) &&
                            align_reference_beacons(scanner_b, current_b);
    }

    current_a = current_a->next;
    current_b = current_b->next;
  }

  return common_distances;
}

static void match_scanners(scanner_t *head) {
  bool is_matched = false;

  head->is_aligned = true;

  while (!is_matched) {
    is_matched = true;

    scanner_t *current = head->next;

    while (current != NULL) {
      if (current->is_aligned) {
        current = current->next;
        continue;
      }

      if (count_common_distances(head, current) >= 66) {
        align_scanner_beacons(current, head);
        merge_scanner_beacons(current, head);
        is_matched = false;
      }

      current = current->next;
    }
  }
}

static scanner_t *parse_scanners(const char *input) {
  char buffer[1000];
  uint32_t offset = 0, read = 0;

  scanner_t *head = NULL, *current = NULL, *previous = NULL;

  while (1 == sscanf(input + offset, "%[^\n]\n%n", buffer, &read)) {
    if (buffer[1] == '-') {
      current = (scanner_t *)calloc(1, sizeof(scanner_t));
      if (head == NULL)
        head = current;
      if (previous != NULL)
        previous->next = current;
      previous = current;
      offset += read;
      continue;
    }

    beacon_t *beacon = (beacon_t *)calloc(1, sizeof(beacon_t));
    sscanf(buffer, "%d,%d,%d", &beacon->point.x, &beacon->point.y,
           &beacon->point.z);

    if (insert_unseen_beacon(current, beacon))
      compute_beacon_distances(current, beacon);

    offset += read;
  }

  return head;
}

static void destroy_scanners(scanner_t *head) {
  scanner_t *curr_scanner = head, *next_scanner = NULL;

  while (curr_scanner != NULL) {
    next_scanner = curr_scanner->next;

    beacon_t *current_beacon = curr_scanner->beacons, *next_beacon = NULL;
    while (current_beacon != NULL) {
      next_beacon = current_beacon->next;
      free(current_beacon);
      current_beacon = next_beacon;
    }

    distance_t *current_distance = curr_scanner->distances,
               *next_distance = NULL;
    while (current_distance != NULL) {
      next_distance = current_distance->next;
      free(current_distance);
      current_distance = next_distance;
    }

    free(curr_scanner);

    curr_scanner = next_scanner;
  }
}

static uint64_t part1(const char *input) {
  scanner_t *head = parse_scanners(input);
  match_scanners(head);

  uint64_t total_beacons = 0;
  beacon_t *current = head->beacons;
  while (current != NULL) {
    total_beacons++;
    current = current->next;
  }

  destroy_scanners(head);

  return total_beacons;
}

static uint64_t part2(const char *input) {
  scanner_t *head = parse_scanners(input);
  match_scanners(head);

  scanner_t *scanner = head;
  uint64_t max_distance = 0;

  while (scanner != NULL) {
    point_t point_a = scanner->position;

    scanner_t *other_scanner = scanner->next;
    while (other_scanner != NULL) {
      point_t point_b = other_scanner->position;
      max_distance = MAX(max_distance, abs(point_b.x - point_a.x) +
                                           abs(point_b.y - point_a.y) +
                                           abs(point_b.z - point_a.z));
      other_scanner = other_scanner->next;
    }

    scanner = scanner->next;
  }

  destroy_scanners(head);

  return max_distance;
}

AOC_MAIN(day19, 315, 13192);
