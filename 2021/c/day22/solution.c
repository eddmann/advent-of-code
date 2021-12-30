#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>

typedef struct {
  int64_t x1, x2, y1, y2, z1, z2;
  bool on;
} cuboid_t;

static cuboid_t *parse_cuboids(const char *input) {
  cuboid_t *cuboids = dynarray_create(cuboid_t);

  size_t offset = 0, read = 0;
  int64_t x1, y1, z1, x2, y2, z2;
  char state[5];

  while (sscanf(input + offset,
                " %s x=%" PRId64 "..%" PRId64 ",y=%" PRId64 "..%" PRId64
                ",z=%" PRId64 "..%" PRId64 "%n",
                state, &x1, &x2, &y1, &y2, &z1, &z2, &read) == 7) {
    cuboid_t c = {x1, x2, y1, y2, z1, z2, state[1] == 'n'};
    dynarray_push(cuboids, c);
    offset += read;
  }

  return cuboids;
}

static bool has_intersection(cuboid_t a, cuboid_t b) {
  return !(a.x2 < b.x1 || a.x1 > b.x2 || a.y2 < b.y1 || a.y1 > b.y2 ||
           a.z2 < b.z1 || a.z1 > b.z2);
}

static cuboid_t intersect(cuboid_t a, cuboid_t b) {
  return (cuboid_t){.x1 = MAX(a.x1, b.x1),
                    .x2 = MIN(a.x2, b.x2),
                    .y1 = MAX(a.y1, b.y1),
                    .y2 = MIN(a.y2, b.y2),
                    .z1 = MAX(a.z1, b.z1),
                    .z2 = MIN(a.z2, b.z2),
                    .on = !b.on};
}

static int64_t volume(cuboid_t c) {
  return (c.x2 - c.x1 + 1) * (c.y2 - c.y1 + 1) * (c.z2 - c.z1 + 1);
}

static int64_t total_on_cubes(cuboid_t *cuboids) {
  cuboid_t *partial_cuboids = dynarray_create(cuboid_t);

  for (uint16_t i = 0; i < dynarray_length(cuboids); i++) {
    uint16_t num_partial_cuboids = dynarray_length(partial_cuboids);

    for (uint16_t j = 0; j < num_partial_cuboids; j++) {
      if (has_intersection(cuboids[i], partial_cuboids[j])) {
        cuboid_t intersection = intersect(cuboids[i], partial_cuboids[j]);
        dynarray_push(partial_cuboids, intersection);
      }
    }

    if (cuboids[i].on) {
      dynarray_push(partial_cuboids, cuboids[i]);
    }
  }

  int64_t total = 0;
  for (int i = 0; i < dynarray_length(partial_cuboids); i++) {
    total += (partial_cuboids[i].on ? 1 : -1) * volume(partial_cuboids[i]);
  }

  dynarray_destroy(partial_cuboids);

  return total;
}

uint64_t day22_part1(const char *input) {
  cuboid_t *cuboids = parse_cuboids(input);

  cuboid_t *bounded_cuboids = dynarray_create(cuboid_t);
  for (uint16_t i = 0; i < dynarray_length(cuboids); i++) {
    static const cuboid_t bounds = {-50, 50, -50, 50, -50, 50, false};
    if (has_intersection(cuboids[i], bounds)) {
      dynarray_push(bounded_cuboids, cuboids[i]);
    }
  }

  uint64_t total = total_on_cubes(bounded_cuboids);

  dynarray_destroy(bounded_cuboids);
  dynarray_destroy(cuboids);

  return total;
}

uint64_t day22_part2(const char *input) {
  cuboid_t *cuboids = parse_cuboids(input);

  uint64_t total = total_on_cubes(cuboids);

  dynarray_destroy(cuboids);

  return total;
}

AOC_MAIN(day22, 612714, 1311612259117092);
