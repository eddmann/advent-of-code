#include "../shared/aoc.h"

#define VELOCITY_BOUNDS 157

typedef struct {
  int32_t from_x, to_x;
  int32_t from_y, to_y;
} target_bounds_t;

static target_bounds_t parse_target_bounds(const char *input) {
  target_bounds_t target_bounds;

  sscanf(input,
         "target area: x=%" SCNu32 "..%" SCNu32 ", y=%" SCNu32 "..%" SCNu32,
         &target_bounds.from_x, &target_bounds.to_x, &target_bounds.from_y,
         &target_bounds.to_y);

  return target_bounds;
}

static uint32_t max_height_reached(int32_t vel_x, int32_t vel_y,
                                   target_bounds_t target_bounds) {
  int32_t cur_x = 0, cur_y = 0;
  int32_t max_y = 0;

  while (cur_x <= target_bounds.to_x && cur_y >= target_bounds.from_y) {
    cur_x += vel_x;
    cur_y += vel_y;
    vel_x = (vel_x - 1 < 0) ? 0 : vel_x - 1;
    vel_y -= 1;

    max_y = MAX(max_y, cur_y);

    if (cur_x >= target_bounds.from_x && cur_x <= target_bounds.to_x &&
        cur_y >= target_bounds.from_y && cur_y <= target_bounds.to_y) {
      return max_y;
    }
  }

  return 0;
}

static bool is_target_hit(int32_t vel_x, int32_t vel_y,
                          target_bounds_t target_bounds) {
  int32_t cur_x = 0, cur_y = 0;

  while (cur_x <= target_bounds.to_x && cur_y >= target_bounds.from_y) {
    cur_x += vel_x;
    cur_y += vel_y;
    vel_x = (vel_x - 1 < 0) ? 0 : vel_x - 1;
    vel_y -= 1;

    if (cur_x >= target_bounds.from_x && cur_x <= target_bounds.to_x &&
        cur_y >= target_bounds.from_y && cur_y <= target_bounds.to_y) {
      return true;
    }
  }

  return false;
}

static uint64_t part1(const char *input) {
  target_bounds_t target_bounds = parse_target_bounds(input);

  uint64_t max = 0;

  for (int32_t x = 0; x < VELOCITY_BOUNDS; x++) {
    for (int32_t y = -VELOCITY_BOUNDS; y < VELOCITY_BOUNDS; y++) {
      max = MAX(max, max_height_reached(x, y, target_bounds));
    }
  }

  return max;
}

static uint64_t part2(const char *input) {
  target_bounds_t target_bounds = parse_target_bounds(input);

  uint64_t total = 0;

  for (int32_t x = 0; x < VELOCITY_BOUNDS; x++) {
    for (int32_t y = -VELOCITY_BOUNDS; y < VELOCITY_BOUNDS; y++) {
      total += is_target_hit(x, y, target_bounds);
    }
  }

  return total;
}

AOC_MAIN(day17, 12246, 3528);
