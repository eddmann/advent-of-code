#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdint.h>
#include <stdlib.h>

#define sgn(a, b) (b < a) - (a < b)

typedef struct Vent {
  uint16_t x1, y1, x2, y2;
} vent_t;

static vent_t *parse_hydrothermal_vents(const char *input) {
  vent_t *vents = dynarray_create(vent_t);

  uint16_t x1, y1, x2, y2;
  size_t offset = 0, read = 0;
  while (4 == sscanf(input + offset,
                     "%" SCNu16 ",%" SCNu16 "%*s%" SCNu16 ",%" SCNu16 "%n", &x1,
                     &y1, &x2, &y2, &read)) {
    vent_t vent = {.x1 = x1, .y1 = y1, .x2 = x2, .y2 = y2};
    dynarray_push(vents, vent);
    offset += read;
  }

  return vents;
}

static uint16_t max_coord(vent_t *hydrothermal_vents) {
  uint16_t max;

  for (size_t i = 0; i < dynarray_length(hydrothermal_vents); i++) {
    max = MAX(max, MAX(hydrothermal_vents[i].x1, hydrothermal_vents[i].x2));
    max = MAX(max, MAX(hydrothermal_vents[i].y1, hydrothermal_vents[i].y2));
  }

  return max;
}

uint16_t day05_part1(const char *input) {
  vent_t *hydrothermal_vents = parse_hydrothermal_vents(input);

  size_t coord = max_coord(hydrothermal_vents) + 1;
  uint16_t grid[coord][coord];
  memset(grid, 0, sizeof(uint16_t) * coord * coord);

  uint16_t overlaps = 0;

  for (size_t i = 0; i < dynarray_length(hydrothermal_vents); i++) {
    vent_t vent = hydrothermal_vents[i];

    if (vent.x1 != vent.x2 && vent.y1 != vent.y2) {
      continue;
    }

    uint16_t dx = sgn(vent.x2, vent.x1), dy = sgn(vent.y2, vent.y1);
    uint16_t x = vent.x1, y = vent.y1;
    uint16_t stop_x = vent.x2 + dx, stop_y = vent.y2 + dy;

    while (x != stop_x || y != stop_y) {
      if (++grid[x][y] == 2) {
        overlaps += 1;
      }
      x += dx;
      y += dy;
    }
  }

  dynarray_destroy(hydrothermal_vents);

  return overlaps;
}

uint16_t day05_part2(const char *input) {
  vent_t *hydrothermal_vents = parse_hydrothermal_vents(input);

  uint16_t coord = max_coord(hydrothermal_vents) + 1;
  uint16_t grid[coord][coord];
  memset(grid, 0, sizeof(uint16_t) * coord * coord);

  uint16_t overlaps = 0;

  for (size_t i = 0; i < dynarray_length(hydrothermal_vents); i++) {
    vent_t vent = hydrothermal_vents[i];

    uint16_t dx = sgn(vent.x2, vent.x1), dy = sgn(vent.y2, vent.y1);
    uint16_t x = vent.x1, y = vent.y1;
    uint16_t stop_x = vent.x2 + dx, stop_y = vent.y2 + dy;

    while (x != stop_x || y != stop_y) {
      if (++grid[x][y] == 2) {
        overlaps += 1;
      }
      x += dx;
      y += dy;
    }
  }

  dynarray_destroy(hydrothermal_vents);

  return overlaps;
}

AOC_MAIN(day05, 5690, 17741);
