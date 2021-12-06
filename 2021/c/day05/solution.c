#include "../shared/aoc.h"
#include "../shared/dynarray.h"
#include <stdlib.h>

#define sgn(a, b) (b < a) - (a < b)
#define max(a, b)                                                              \
  ({                                                                           \
    __typeof__(a) _a = (a);                                                    \
    __typeof__(b) _b = (b);                                                    \
    _a > _b ? _a : _b;                                                         \
  })

typedef struct Vent {
  int x1;
  int y1;
  int x2;
  int y2;
} vent;

vent *parse_hydrothermal_vents(char *input) {
  vent *vents = dynarray_create(vent);

  int x1, y1, x2, y2, offset, read;
  while (4 == sscanf(input + offset, "%d,%d%*s%d,%d%n", &x1, &y1, &x2, &y2, &read)) {
    vent vent = {.x1 = x1, .y1 = y1, .x2 = x2, .y2 = y2};
    dynarray_push(vents, vent);
    offset += read;
  }

  return vents;
}

int max_coord(vent *hydrothermal_vents) {
  int max;

  for (int i = 0; i < dynarray_length(hydrothermal_vents); i++) {
    max = max(max, max(hydrothermal_vents[i].x1, hydrothermal_vents[i].x2));
    max = max(max, max(hydrothermal_vents[i].y1, hydrothermal_vents[i].y2));
  }

  return max;
}

int part1(char *input) {
  vent *hydrothermal_vents = parse_hydrothermal_vents(input);

  int coord = max_coord(hydrothermal_vents) + 1;
  int grid[coord][coord];
  memset(grid, 0, sizeof(int) * coord * coord);

  int overlaps = 0;

  for (int i = 0; i < dynarray_length(hydrothermal_vents); i++) {
    vent vent = hydrothermal_vents[i];

    if (vent.x1 != vent.x2 && vent.y1 != vent.y2) {
      continue;
    }

    int dx = sgn(vent.x2, vent.x1), dy = sgn(vent.y2, vent.y1);
    int x = vent.x1, y = vent.y1;
    int stop_x = vent.x2 + dx, stop_y = vent.y2 + dy;

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

int part2(char *input) {
  vent *hydrothermal_vents = parse_hydrothermal_vents(input);

  int coord = max_coord(hydrothermal_vents) + 1;
  int grid[coord][coord];
  memset(grid, 0, sizeof(int) * coord * coord);

  int overlaps = 0;

  for (int i = 0; i < dynarray_length(hydrothermal_vents); i++) {
    vent vent = hydrothermal_vents[i];

    int dx = sgn(vent.x2, vent.x1), dy = sgn(vent.y2, vent.y1);
    int x = vent.x1, y = vent.y1;
    int stop_x = vent.x2 + dx, stop_y = vent.y2 + dy;

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

AOC_MAIN();
